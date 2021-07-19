import type { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { configBuildAndValidate } from "./config.build-config";
import { User } from "./entity.user";
import { createAccessToken } from "./lib.authentication";
import { sendRefreshToken } from "./lib.utilities.send-refresh-token";

export async function refreshTokenController(dbConnection: any, req: Request, res: Response) {
  // First grab our config to get the secret
  // needed to decode the token.
  let config;
  try {
    config = await configBuildAndValidate();
  } catch (error) {
    console.error("ERROR GETTING CONFIG - REFRESH TOKEN");
    console.error(error);
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
    console.error("ERROR VERIFYING REFRESH TOKEN PAYLOAD");
    console.error(error);
    throw new Error(error);
  }

  // Fourth - the token is valid and we can access the
  // User inside.
  let user;

  try {
    user = await dbConnection.getRepository(User).findOne(token.payload.id);
  } catch (error) {
    console.error("ERROR FINDING USER");
    console.error(error);
    throw new Error(error);
  }

  if (!user) {
    return res.send({ ok: false, accessToken: "" });
  }

  // If the (refresh) token versions don't match the token is invalid.
  if (typeof payload !== "string" && user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: "" });
  }

  if (user) {
    console.log("SENDING REFRESH TOKEN");

    // Reset our refresh token inside the secure cookie.
    sendRefreshToken({ config, res, user });

    // In addition we return a new access token.
    // In the end this route returns new access tokens
    // and renews its ability to request new access tokens.
    return res.send({ ok: false, accessToken: createAccessToken({ config, user }) });
  }

  // If we can't find a user send a failure case.
  res.status(400).send("Unable to verify token");
}
