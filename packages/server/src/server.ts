import "reflect-metadata";
import { ApolloServer, ApolloError } from "apollo-server-express";
import * as Express from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { ArgumentValidationError } from "type-graphql";
import { createConnection, Connection } from "typeorm";
import { GraphQLFormattedError, GraphQLError } from "graphql";
import session from "express-session";
import connectRedis from "connect-redis";
import type { Config } from "convict";
import internalIp from "internal-ip";
import colors from "colors/safe";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import QueryString from "qs";

import { redis } from "./redis";
import { redisSessionPrefix } from "./constants";
import { createSchema } from "./create-schema";
import { devOrmconfig } from "./config.orm-dev";
import { productionOrmConfig } from "./config.orm-prod";
import { MyContext } from "./types";
import { User } from "./entity.user";
import { createAuthorizationError } from "./config.apollo-errors";
import { ServerConfigProps, ServerConfigSchema } from "./config";
import pino from "pino";

const port = process.env.INTERNAL_API_PORT ? parseInt(process.env.INTERNAL_API_PORT, 10) : 5050;

const RedisStore = connectRedis(session);

let sessionMiddleware: Express.RequestHandler;

const nodeEnvIsProd = process.env.NODE_ENV === "production";

const ormConnection = nodeEnvIsProd ? productionOrmConfig : devOrmconfig;

const getContextFromHttpRequest = (req: MyContext["req"], res: MyContext["res"]) => {
  // old cookie implementation
  if (req && req.session) {
    const { teamId, userId } = req.session;
    console.log("I CAN SEE REQ.SESSION");

    return { userId, req, res, teamId };
  }

  // JWT implementation
  // const authorization = req.headers["authorization"];
  // if (authorization) {
  //   try {
  //     const token = authorization.split(" ")[1];
  //     const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
  //     return {
  //       req,
  //       res,
  //       payload: { token: payload },
  //       token: req.headers.authorization || "",
  //     };
  //   } catch (err) {
  //     console.log("IS AUTH ERROR", err);
  //     if (err.name === "TokenExpiredError") {
  //       throw createAuthorizationError({
  //         message: "Your session has expired, please log in.",
  //       });
  //     }
  //     throw createAuthorizationError({ message: "Not Authorized." });

  //     // throw new Error("Not authenticated");
  //     // return {
  //     //   req,
  //     //   res,
  //     //   payload: {
  //     //     token: undefined,
  //     //     errors: [err],
  //     //   },
  //     //   token: req.headers.authorization || "",
  //     // };
  //   }
  // } else {
  //   return { req, res };
  // }
};

const getContextFromSubscription = (connection: any) => {
  // old cookie implementation
  const { userId } = connection.context.req.session;

  return { req: connection.context.req, res: connection.context.res, userId };
  // const authorization = connection.context.authorization;
  // if (authorization) {
  //   try {
  //     const token = authorization.split(" ")[1];
  //     const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
  //     return {
  //       payload: { token: payload },
  //       req: connection.context.req,
  //       res: connection.context.res,
  //       teamId: connection.context.teamId,
  //       token: authorization,
  //     };
  //   } catch (error) {
  //     throw Error("Error authenticating subscription.");
  //   }
  // } else {
  //   return { req: connection.context.req, res: connection.context.res };
  // }
};

export async function server(config: ServerConfigProps) {
  let dbConnection: Connection | undefined;

  try {
    dbConnection = await createConnection(config.db.connectionString);
  } catch (error) {
    console.warn("CONNECTION ERROR", error);
  }

  let retries = 5;
  // Loop to run migrations. Keep
  // trying until
  while (retries) {
    try {
      await dbConnection?.runMigrations();
      console.log("MIGRATIONS HAVE BEEN RUN");
      break;
    } catch (error) {
      console.error("ERROR RUNNING TYPEORM MIGRATIONS");
    }

    retries -= 1;
    // eslint-disable-next-line no-console
    console.log(`\n\nRETRIES LEFT: ${retries}\n\n`);
    // wait 5 seconds
    setTimeout(() => console.log("TIMEOUT FIRING"), 5000);
  }

  const schema = createSchema();

  const apolloServer = new ApolloServer({
    introspection: true,
    playground: { version: "1.7.25", endpoint: "/graphql" },
    schema,
    context: ({ req, res, connection }: any) => {
      if (connection) {
        return getContextFromSubscription(connection);
        // return {
        //   ...getContextFromSubscription(connection),
        //   usersLoader: createUsersLoader()
        // };
      }

      return getContextFromHttpRequest(req, res);

      // return {
      //   ...getContextFromHttpRequest(req, res),
      //   usersLoader: createUsersLoader()
      // };

      // return { req, res, connection }
    },
    subscriptions: {
      path: "/subscriptions",
      onConnect: (_connectionParams, _webSocket, _context) => {
        console.log("Client connected");
      },
      onDisconnect: (_webSocket, _context) => {
        console.log("Client disconnected");
      },
      // onConnect: (_, ws: any) => {
      //   return new Promise((res) =>
      //     sessionMiddleware(ws.upgradeReq, {} as any, () => {
      //       res({ req: ws.upgradeReq });
      //     })
      //   );
      // },
    },
    // custom error handling from:
    // https://github.com/19majkel94/type-graphql/issues/258
    formatError: (error: GraphQLError): GraphQLFormattedError => {
      if (error.originalError instanceof ApolloError) {
        return error;
      }

      const { extensions = {}, locations, message, path } = error;

      if (error.originalError instanceof ArgumentValidationError) {
        extensions.code = "GRAPHQL_VALIDATION_FAILED";

        return {
          extensions,
          locations,
          message,
          path,
        };
      }

      return {
        message: extensions?.exception?.stacktrace[0].replace("Error: ", "") ?? message,
        path,
        locations,
        // extensions
      };
    },
    validationRules: [],
  });

  const homeIp = internalIp.v4.sync();

  const app = Express.default();

  const allowedListOfOrigins = [config.client_uri];

  const corsOptions = {
    credentials: true,
    methods: "GET,HEAD,POST,OPTIONS",
    optionsSuccessStatus: 200,
    preflightContinue: false,
    // allowedHeaders:,
    origin: function (origin: any, callback: any) {
      if (!origin || allowedListOfOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.error("cors error:: origin: ", {
          origin,
          allowedListOfOrigins,
        });
      }
    },
  };

  let sessionMiddleware:
    | Express.RequestHandler<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>
    | undefined = undefined;

  // old cookie implentation
  if (config.env === "production") {
    sessionMiddleware = session({
      cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
        domain: process.env.PRODUCTION_CLIENT_ORIGIN,
        path: "/",
      },
      name: process.env.COOKIE_NAME,
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET as string,
      store: new RedisStore({
        client: redis as any,
        prefix: redisSessionPrefix,
      }),
    });
  } else {
    sessionMiddleware = session({
      name: process.env.COOKIE_NAME,
      secret: process.env.SESSION_SECRET as string,
      store: new RedisStore({
        client: redis as any,
        prefix: redisSessionPrefix,
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
        domain: `${homeIp}`,
      },
    });
  }

  // we're bypassing cors used by apollo-server-express here
  app.use((_req, _res, next) => {
    next();
  }, cors(corsOptions));

  app.options(
    "*",
    (_req, _res, next) => {
      next();
    },
    cors(corsOptions)
  );

  app.use(cookieParser());
  app.use(sessionMiddleware);

  // app.use(pino);
  app.get("/", (_req, res) => res.send("hello"));

  apolloServer.applyMiddleware({ app, cors: false });

  let httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  // needed for heroku deployment
  app.enable("trust proxy");

  // needed for heroku deployment
  // they set the "x-forwarded-proto" header???
  if (nodeEnvIsProd) {
    app.use(function (req, res, next) {
      if (req.header("x-forwarded-proto") !== "https") {
        res.redirect("https://" + req.header("host") + req.url);
      } else {
        next();
      }
    });
  }

  httpServer.listen(port, () => {
    console.log(`

${colors.bgYellow(colors.black("    server started    "))}

GraphQL Playground available at:
    ${colors.green("localhost")}: http://localhost:${port}${apolloServer.graphqlPath}
          ${colors.green("LAN")}: http://${homeIp}:${port}${apolloServer.graphqlPath}

WebSocket subscriptions available at:
${colors.green("slack_clone server")}: ws://${homeIp}:${port}${apolloServer.subscriptionsPath}


`);
  });
}
