import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as Express from "express";
import http from "http";
import internalIp from "internal-ip";
import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { configApolloContext } from "./config.apollo-context";
import { configGraphQLSubscriptions, configSessionMiddleware } from "./config.apollo-subscriptions";
import { ServerConfigProps } from "./config.build-config";
import { formatGraphQLErrors } from "./config.format-apollo-errors";
import { serverOnListen } from "./config.server.on-listen";
import { createSchema } from "./lib.apollo.create-schema";
import { getConnectionOptionsCustom } from "./lib.dev-orm-config";

export async function server(config: ServerConfigProps) {
  let dbConnection: Connection | undefined;

  const connectOptions: PostgresConnectionOptions = getConnectionOptionsCustom(config);

  try {
    dbConnection = await createConnection(connectOptions);
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
    playground: { version: "1.7.25", endpoint: config.apiEndpoint },
    schema,
    context: configApolloContext,
    subscriptions: configGraphQLSubscriptions(config),
    formatError: formatGraphQLErrors,
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

  let sessionMiddleware = configSessionMiddleware(config);

  app.use(sessionMiddleware);

  // app.use(pino);
  app.get("/", (_req, res) => res.send("hello"));

  apolloServer.applyMiddleware({ app, cors: corsOptions, path: config.apiEndpoint });

  let httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  // needed for heroku deployment
  app.enable("trust proxy");

  // needed for heroku deployment
  // they set the "x-forwarded-proto" header???
  if (config.env === "production") {
    app.use(function (req, res, next) {
      if (req.header("x-forwarded-proto") !== "https") {
        res.redirect("https://" + req.header("host") + req.url);
      } else {
        next();
      }
    });
  }

  httpServer.listen(config.port, config.host, () =>
    serverOnListen(config, {
      graphqlPath: apolloServer.graphqlPath,
      subscriptionsPath: apolloServer.subscriptionsPath || "uknown error, undefined",
      homeIp: config.host,
      port: config.port,
    })
  );
}
