import { verify } from "jsonwebtoken";
import { JwtExpirationError, JwtMalformedError } from "./config.apollo-errors";
import { ServerConfigProps } from "./config.build-config";
import { logger } from "./lib.logger";
import { MyContext } from "./typings";

interface ConfigApolloProps {
  req: MyContext["req"];
  res: MyContext["res"];
  connection?: MyContext["connection"];
  dbConnection: MyContext["dbConnection"];
  config: ServerConfigProps;
}

export function configApolloContext({ req, res, connection, config, dbConnection }: ConfigApolloProps) {
  if (connection) {
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

  logger.info({ authorization }, "GET CONTEXT FROM HTTP REQUEST");

  if (authorization && authorization !== "Bearer public") {
    let token;
    try {
      token = authorization.split(" ")[1];
      const payload = verify(token, config.accessTokenSecret);

      return {
        req,
        res,
        payload,
        token: req.headers.authorization || "",
        dbConnection,
        config,
      };
    } catch (err) {
      logger.error(err, "ERROR VERIFYING TOKEN - HTTP REQUESTS");

      if (err.message.includes("jwt expired")) {
        logger.error(err, "JWT EXPIRED");

        // throw createAuthenticationError({
        //   message: "Your session has expired, please log in.",
        // });
        throw JwtExpirationError;
      }
      if (err.message.includes("jwt malformed")) {
        logger.error(err, "JWT MALFORMED");

        // throw createAuthenticationError({
        //   message: "Your session has expired, please log in.",
        // });
        throw JwtMalformedError;
      }

      // If it's not expired or malformed, but some other error?
      throw new Error("Unknown JWT error");
      // return { req, res, config, dbConnection };

      // throw new Error("Not authenticated");
      // return {
      //   req,
      //   res,
      //   payload: {
      //     token: undefined,
      //     errors: [err],
      //   },
      //   token: req.headers.authorization || "",
      // };
    }
  } else {
    return { req, res, config, dbConnection };
  }
};

const getContextFromSubscription = ({ config, connection, dbConnection }: ConfigApolloProps) => {
  // old cookie implementation
  if (connection) {
    const authorization = connection.context.req.headers["authorization"];

    let token;
    let payload;

    try {
      token = authorization.split(" ")[1];
      payload = verify(token, config.accessTokenSecret);
      return { req: connection.context.req, res: connection.context.res, payload, dbConnection, config };
    } catch (error) {
      console.error("ERROR VERIFYING JWT - SUBSCRIPTIONS");
      console.error(error);
      if (error.message.includes("jwt expired")) {
        console.error("JWT EXPIRED");
        console.error(error);

        // throw createAuthenticationError({
        //   message: "Your session has expired, please log in.",
        // });
        throw JwtExpirationError;
        // throw new Error("Your session has expired, please log in.");
      }
    }
    return { req: connection.context.req, res: connection.context.res, dbConnection, config };
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
