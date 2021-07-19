import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { configBuildAndValidate } from "./config.build-config";
import { MyContext } from "./typings";
import { logger } from "./lib.logger";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  const config = await configBuildAndValidate();
  if (!authorization) {
    throw new Error("Not authenticated");
  }

  let token;
  try {
    token = authorization.split(" ")[1];
  } catch (error) {
    console.error(error);
    throw new Error("Not authenticated");
  }

  let payload;

  try {
    payload = verify(token, config.accessTokenSecret);
    if (typeof payload !== "string") {
      context.payload = payload;
    }
  } catch (error) {
    console.error("ERROR VERIFYING JWT");
    console.error(error);
  }

  return next();
};
