import { ExpressContext } from "apollo-server-express";
import type { Connection } from "typeorm";
import { MyContext } from "./typings";

interface ConfigApolloProps {
  req: MyContext["req"];
  res: MyContext["res"];
  connection: MyContext["connection"];
  dbConnection: MyContext["dbConnection"];
}

export function configApolloContext({ req, res, connection, dbConnection }: ConfigApolloProps) {
  if (connection) {
    return getContextFromSubscription(connection, dbConnection);
    // return {
    //   ...getContextFromSubscription(connection),
    //   usersLoader: createUsersLoader()
    // };
  }

  return getContextFromHttpRequest(req, res, dbConnection);

  // return {
  //   ...getContextFromHttpRequest(req, res),
  //   usersLoader: createUsersLoader()
  // };

  // return { req, res, connection }
}

const getContextFromHttpRequest = (
  req: MyContext["req"],
  res: MyContext["res"],
  dbConnection: MyContext["dbConnection"]
) => {
  // Cookie implementation
  if (req && req.session) {
    const { userId } = req.session;

    return { userId, req, res, dbConnection };
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

const getContextFromSubscription = (connection: any, dbConnection: MyContext["dbConnection"]) => {
  // old cookie implementation
  const { userId } = connection.context.req.session;

  return { req: connection.context.req, res: connection.context.res, userId, dbConnection };
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
