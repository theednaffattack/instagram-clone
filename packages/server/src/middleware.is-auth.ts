import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { configBuildAndValidate } from "./config.build-config";
import { logger } from "./lib.logger";
import { MyContext } from "./typings";

export const isAuth: MiddlewareFn<MyContext> = async ({ context, args, info }, next) => {
  const authorization = context.req.headers["authorization"];
  const config = await configBuildAndValidate();
  if (authorization) {
    logger.info("AUTH HEADER IS PRESENT");
    logger.info({ authHeader: context.req.headers["authorization"] });
    logger.info({ infoFieldName: info.fieldName });
  }

  if (!authorization) {
    logger.error("AUTH HEADER MISSING");
    logger.error(context.req.headers);
    logger.info({ infoFieldName: info.fieldName });
    throw new Error("Not authenticated");
  }

  let token;
  try {
    token = authorization.split(" ")[1];
  } catch (error) {
    logger.error({ error });
    logger.error("ERROR GETTING TOKEN FROM AUTH HEADER");
    throw new Error("Not authenticated");
  }

  let payload;

  try {
    payload = verify(token, config.accessTokenSecret);

    if (typeof payload !== "string") {
      context.payload = payload;
    }
  } catch (error) {
    logger.error({ error });
    logger.error("ERROR GETTING TOKEN FROM AUTH HEADER");
    throw new Error("Not authenticated");
  }

  return next();
};
