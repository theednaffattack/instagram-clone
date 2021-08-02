import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { configBuildAndValidate } from "./config.build-config";
import { MyContext } from "./typings";
import { logger } from "./lib.logger";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  const config = await configBuildAndValidate();

  if (!authorization) {
    logger.error("AUTH HEADER MISSING");
    throw new Error("Not authenticated");
  }

  let token;
  try {
    token = authorization.split(" ")[1];
  } catch (error) {
    logger.error(error, "ERROR GETTING TOKEN FROM AUTH HEADER");
    throw new Error("Not authenticated");
  }

  let payload;

  logger.info({ token, secret: config.accessTokenSecret }, "VIEW TOKEN INFO - IS AUTH");
  try {
    payload = verify(token, config.accessTokenSecret);

    if (typeof payload !== "string") {
      context.payload = payload;
    }
  } catch (error) {
    logger.error(error, "ERROR VERIFYING JWT");
    throw new Error("Not authenticated");
  }

  return next();
};
