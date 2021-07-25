import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { configBuildAndValidate } from "./config.build-config";
import { MyContext } from "./typings";
import { logger } from "./lib.logger";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  const config = await configBuildAndValidate();
  logger.info({ authorization }, "1 VIEW AUTH HEADER");
  if (!authorization) {
    throw new Error("Not authenticated");
  }

  let token;
  try {
    token = authorization.split(" ")[1];
    logger.info({ token }, "2 VIEW TOKEN");
  } catch (error) {
    logger.error(error, "ERROR GETTING TOKEN FROM AUTH HEADER");
    throw new Error("Not authenticated");
  }

  let payload;

  try {
    payload = verify(token, config.accessTokenSecret);
    logger.info({ payload }, "3 VIEW PAYLOAD");
    if (typeof payload !== "string") {
      context.payload = payload;
    }
  } catch (error) {
    logger.error(error, "ERROR VERIFYING JWT");
    throw new Error("Not authenticated");
  }
  logger.info("4 NEXT STATEMENT");

  return next();
};
