import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { configBuildAndValidate } from "./config.build-config";
import { handleAsyncSimple } from "./lib.handle-async";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { logger } from "./lib.logger";
import { MyContext } from "./typings";

export const isAuth: MiddlewareFn<MyContext> = async ({ context, args, info }, next) => {
  const authorization = context.req.headers["authorization"];
  // const config = await configBuildAndValidate();
  const [config, configError] = await handleAsyncSimple(async () => await configBuildAndValidate());

  if (configError) {
    logger.error("ERROR GETTING CONFIG OBJECT - IS AUTH");
    handleCatchBlockError(configError);
  }

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
