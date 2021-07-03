import { ApolloServer, ExpressContext } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import * as Express from "express";
import http from "http";
import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { configApolloContext } from "./config.apollo-context";
import { configGraphQLSubscriptions } from "./config.apollo-subscriptions";
import { ServerConfigProps } from "./config.build-config";
import { formatGraphQLErrors } from "./config.format-apollo-errors";
import { serverOnListen } from "./config.server.on-listen";
import { configSessionMiddleware } from "./config.session-middleware";
import { createSchema } from "./lib.apollo.create-schema";
import { getConnectionOptionsCustom } from "./lib.orm-config";
import { productionMigrations } from "./lib.production-migrations";

export async function server(config: ServerConfigProps) {
  let dbConnection: Connection;

  const connectOptions: PostgresConnectionOptions = getConnectionOptionsCustom(config);

  try {
    dbConnection = await createConnection(connectOptions);
  } catch (error) {
    console.warn("CONNECTION ERROR");
    console.error(error);
    throw Error(error);
  }

  if (config.env === "production") {
    try {
      await productionMigrations(dbConnection, connectOptions);
    } catch (error) {
      console.error("ERROR CONFIGURING SESSION MIDDLEWARE");
      console.error(error);
      throw Error(error);
    }
  }

  let schema;

  try {
    schema = await createSchema();
  } catch (error) {
    console.error("ERROR CREATING SCHEMA");
    console.error(error);
    throw Error(error);
  }

  let sessionMiddleware;

  try {
    sessionMiddleware = await configSessionMiddleware(config);
  } catch (error) {
    console.error("ERROR CONFIGURING SESSION MIDDLEWARE");
    console.error(error);
    throw Error(error);
  }

  if (dbConnection !== undefined) {
    const apolloServer = new ApolloServer({
      introspection: true,
      playground: { version: "1.7.25", endpoint: config.apiEndpoint },
      schema,
      context: ({ req, res, connection }: ExpressContext) =>
        configApolloContext({ req, res, connection, dbConnection }),
      subscriptions: configGraphQLSubscriptions(sessionMiddleware),
      formatError: formatGraphQLErrors,
      validationRules: [],
    });

    const app = Express.default();

    const allowedListOfOrigins = [...config.allowedOrigins.split(",")];

    const corsOptions: CorsOptions = {
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "X-Forwarded-Proto",
        "Cookie",
        "Set-Cookie",
        "*",
      ],
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

    app.set("trust proxy", 1);

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

    app.get("/", (_req, res) => res.send("hello"));

    apolloServer.applyMiddleware({ app });

    let httpServer = http.createServer(app);
    apolloServer.installSubscriptionHandlers(httpServer);

    httpServer.listen(config.port, config.ip, () =>
      serverOnListen(config, {
        graphqlPath: apolloServer.graphqlPath,
        subscriptionsPath: apolloServer.subscriptionsPath || "uknown error, undefined",
        homeIp: config.host,
        port: config.port,
      })
    );
  } else {
    throw Error("Wait, there's no connection to our postgres db.");
  }
}
