import type { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { configBuildAndValidate } from "./config.build-config";
import { User } from "./entity.user";
import { createAccessToken } from "./lib.authentication";
import { logger } from "./lib.logger";
import { sendRefreshToken } from "./lib.utilities.send-refresh-token";

export async function refreshTokenController(dbConnection: any, req: Request, res: Response) {
  // First grab our config to get the secret
  // needed to decode the token.
  let config;
  try {
    config = await configBuildAndValidate();
  } catch (error) {
    logger.error(error, "ERROR GETTING CONFIG - REFRESH TOKEN");
    throw new Error(error);
  }

  // Second we'll extract the token from the
  // secure cookie we set during login.
  const token = req.cookies[config.cookieName];

  // Second cont...
  // If we can't find a token (there's no cookie),
  // then reject the post.
  if (!token) {
    return res.send({ ok: false, accessToken: "" });
  }

  // Third we'll verify the token
  // Make sure this is set to "REFRESH TOKEN SECRET"
  let payload = null;
  try {
    payload = verify(token, config.refreshTokenSecret);
  } catch (error) {
    logger.error(error, "ERROR VERIFYING REFRESH TOKEN PAYLOAD");
    throw new Error(error);
  }

  // Fourth - the token is valid and we can access the
  // User inside.
  let user;

  if (typeof payload !== "string") {
    try {
      logger.info({ payload }, "VIEW PAYLOAD");
      user = await dbConnection.getRepository(User).findOne(payload.id);
    } catch (error) {
      logger.error(error, "ERROR FINDING USER");
      throw new Error(error);
    }
  } else {
    const errorMessage = `Expecting jwt payload to be of type 'object'`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  if (!user) {
    return res.send({ ok: false, accessToken: "" });
  }

  // If the (refresh) token versions don't match the token is invalid.
  if (typeof payload !== "string" && user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: "" });
  }

  if (user) {
    logger.info("SENDING REFRESH TOKEN");

    // Reset our refresh token inside the secure cookie.
    sendRefreshToken({ config, res, user });

    // In addition we return a new access token.
    return res.send({ ok: true, accessToken: createAccessToken({ config, user }) });
  }

  // If we can't find a user send a failure case.
  res.status(400).send("Unable to verify token");
}
