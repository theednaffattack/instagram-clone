import { ApolloServer, ExpressContext } from "apollo-server-express";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import * as Express from "express";
import http from "http";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { configApolloContext } from "./config.apollo-context";
import { configGraphQLSubscriptions } from "./config.apollo-subscriptions";
import { ServerConfigProps } from "./config.build-config";
import { formatGraphQLErrors } from "./config.format-apollo-errors";
import { serverOnListen } from "./config.server.on-listen";
import { createSchema } from "./lib.apollo.create-schema";
import { handleAsyncSimple, handleAsyncWithArgs } from "./lib.handle-async";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { logger } from "./lib.logger";
import { appLoggingMiddleware } from "./lib.middleware.app-server-logging";
import { loggingMiddleware } from "./lib.middleware.gql-logging";
import { getConnectionOptionsCustom } from "./lib.orm-config";
import { productionMigrations } from "./lib.production-migrations";
import { refreshTokenController } from "./lib.refresh-token-controller";

export async function server(config: ServerConfigProps): Promise<void> {
  // let dbConnection: Connection;

  const connectOptions: PostgresConnectionOptions = getConnectionOptionsCustom(config);

  // const [dbConnection, dbConnectionError] = await handleAsyncWithArgs(createConnection, [connectOptions]);
  const [dbConnection, dbConnectionError] = await handleAsyncSimple(async () => await createConnection(connectOptions));
  if (dbConnectionError) {
    handleCatchBlockError(dbConnectionError);
  }
  // try {
  //   dbConnection = await createConnection(connectOptions);
  // } catch (error) {
  //   logger.error("CONNECTION ERROR");
  //   logger.error({ error });
  //   // We want to pass the error on here
  //   // because we'd like DB connection issues
  //   // to be show-stopping until they can somehow
  //   // be mitigated (with failovers, I guess???).
  //   if (error instanceof Error) {
  //     throw new Error(error.message);
  //   }
  //   // If it's (bad) old JS code with
  //   // error strings, throw it in a new Error.
  //   if (typeof error === "string") {
  //     throw new Error(error);
  //   }
  //   // Any errors of unexpected shape
  //   // get stringified and thrown as new
  //   // Errors.
  //   throw new Error(JSON.stringify(error));
  // }

  if (config.env === "production" || config.migration === true) {
    // const [, dbMigrationError] = await handleAsyncWithArgs(productionMigrations, [dbConnection, connectOptions]);
    const [, dbMigrationError] = await handleAsyncSimple(async () => await productionMigrations(dbConnection));
    if (dbMigrationError) {
      logger.error("ERROR RUNNING MIGRATIONS");
      handleCatchBlockError(dbMigrationError);
    }
  }

  const [schema, error] = await handleAsyncSimple(createSchema);
  if (error) {
    handleCatchBlockError(error);
  }

  // let sessionMiddleware;

  // try {
  //   sessionMiddleware = await configSessionMiddleware(config);
  // } catch (error) {
  //   console.error("ERROR CONFIGURING SESSION MIDDLEWARE");
  //   console.error(error);
  //   throw Error(error);
  // }

  if (dbConnection !== undefined) {
    const apolloServer = new ApolloServer({
      introspection: true,
      playground: { version: "1.7.25", endpoint: config.apiEndpoint },
      schema,
      context: ({ req, res, connection }: ExpressContext) =>
        configApolloContext({ req, res, connection, dbConnection, config }),
      subscriptions: configGraphQLSubscriptions(),
      formatError: formatGraphQLErrors,
      validationRules: [],
    });

    const app = Express.default();

    const allowedListOfOrigins = [...config.allowedOrigins.split(",")];

    const corsOptions: CorsOptions = {
      credentials: true,
      methods: "GET,HEAD,POST,OPTIONS",
      optionsSuccessStatus: 200,
      preflightContinue: false,
      origin: function (origin: any, callback: any) {
        if (!origin || allowedListOfOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          logger.error(
            {
              origin,
              allowedListOfOrigins,
            },
            "cors error:: origin: "
          );
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

    app.use(json());
    app.use(cookieParser());
    // app.use(sessionMiddleware);

    app.use(appLoggingMiddleware);

    // timing middleware
    // adapted from: https://www.youtube.com/watch?v=ejWS2g0Td08&ab_channel=BenAwad
    app.use("/graphql", loggingMiddleware);

    apolloServer.applyMiddleware({ app, cors: corsOptions });

    app.get("/", (_req, res) => res.send("hello"));

    app.post("/refresh_token", async (req, res, next) => {
      const [, refreshError] = await handleAsyncSimple(
        async () => await refreshTokenController(dbConnection, req, res)
      );
      if (refreshError) {
        next(refreshError);
      }
    });

    const httpServer = http.createServer(app);
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
