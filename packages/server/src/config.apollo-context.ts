import { verify } from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { JwtExpirationError, JwtMalformedError } from "./config.apollo-errors";
import type { ServerConfigProps } from "./config.build-config";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { guardFilterError } from "./lib.guardFilterError";
import { logger } from "./lib.logger";
import type { MyContext } from "./typings";
import type { Connection } from "typeorm";

interface ConfigApolloProps {
  req: MyContext["req"];
  res: MyContext["res"];
  connection?: MyContext["connection"];
  dbConnection: MyContext["dbConnection"];
  config: ServerConfigProps;
}

type ContextConnection = {
  req: any;
  res: any;
  payload: string | JwtPayload;
  dbConnection: Connection;
  config: ServerConfigProps;
};

export function configApolloContext({
  req,
  res,
  connection,
  config,
  dbConnection,
}: ConfigApolloProps): ConfigApolloProps | ContextConnection | undefined {
  if (connection !== undefined) {
    return getContextFromSubscription({ req, res, dbConnection, config, connection });
    // return {
    //   ...getContextFromSubscription(connection),
    //   usersLoader: createUsersLoader()
    // };
  }

  return getContextFromHttpRequest({ req, res, dbConnection, config });

  // return {
  //   ...getContextFromHttpRequest(req, res),
  //   usersLoader: createUsersLoader()
  // };

  // return { req, res, connection }
}

const getContextFromHttpRequest = ({ req, res, dbConnection, config }: ConfigApolloProps) => {
  // Cookie implementation
  // if (req && req.session) {
  //   const { userId } = req.session;

  //   return { userId, req, res, dbConnection, config };
  // }

  // JWT implementation
  const authorization = req.headers["authorization"];
  const defaultReturn = { req, res, config, dbConnection };

  logger.info({ path: req.path, url: req.url });
  // DECISIONS
  // If this is accessed during login return default
  if (req.url === "/") {
    return defaultReturn;
  }

  // Otherwise look for authorization header
  if (authorization && authorization !== "Bearer public") {
    let token;
    try {
      token = authorization.split(" ")[1];
      const payload = verify(token, config.accessTokenSecret);

      const authenticatedReturn = {
        req,
        res,
        payload,
        token: req.headers.authorization || "",
        dbConnection,
        config,
      };

      return authenticatedReturn;
    } catch (err) {
      logger.error("ERROR VERIFYING TOKEN - HTTP REQUESTS");
      const expired = { errorToThrow: JwtExpirationError, errorMessageToSearch: "jwt expired" };
      const malformed = { errorToThrow: JwtMalformedError, errorMessageToSearch: "jwt malformed" };
      // Catch expired JWT
      guardFilterError(err, expired);
      // Catch improperly formatted JWT
      guardFilterError(err, malformed);
      // Catch all other errors
      handleCatchBlockError(err);
    }
  } else {
    return defaultReturn;
  }
};

const getContextFromSubscription = ({ config, connection, dbConnection }: ConfigApolloProps) => {
  // old cookie implementation
  if (connection) {
    const authorization = connection.context.req.headers["authorization"];
    if (authorization) {
      let token;
      let payload;

      try {
        token = authorization.split(" ")[1];
        payload = verify(token, config.accessTokenSecret);
        return { req: connection.context.req, res: connection.context.res, payload, dbConnection, config };
      } catch (error) {
        logger.error("ERROR VERIFYING JWT - SUBSCRIPTIONS");

        const expired = { errorToThrow: JwtExpirationError, errorMessageToSearch: "jwt expired" };
        const malformed = { errorToThrow: JwtMalformedError, errorMessageToSearch: "jwt malformed" };
        // Catch expired JWT
        guardFilterError(error, expired);
        // Catch improperly formatted JWT
        guardFilterError(error, malformed);
        // Catch all other errors
        handleCatchBlockError(error);
      }
      return { req: connection.context.req, res: connection.context.res, dbConnection, config };
    }
  }
  // JSON Web token implementation
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
