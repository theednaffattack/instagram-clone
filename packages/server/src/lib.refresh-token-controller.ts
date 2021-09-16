import type { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { configBuildAndValidate } from "./config.build-config";
import { User } from "./entity.user";
import { createTokenData } from "./lib.create-token-data";
import { handleAsyncSimple, handleAsyncWithArgs } from "./lib.handle-async";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { logger } from "./lib.logger";
import { sendRefreshToken } from "./lib.utilities.send-refresh-token";

interface RefreshResponse {
  ok: boolean;
  tokenData: {
    accessToken: string;
    expiresIn: Date;
    userId: string;
    version: number;
  };
}

export async function refreshTokenController(dbConnection: any, req: Request, res: Response) {
  // First grab our config to get the secret
  // needed to decode the token.

  const [config, configError] = await handleAsyncSimple(configBuildAndValidate);

  if (configError) {
    logger.error("ERROR GETTING CONFIG - REFRESH TOKEN");
    handleCatchBlockError(configError);
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
    logger.error("ERROR VERIFYING REFRESH TOKEN PAYLOAD");
    logger.error({ error, token, secret: config.refreshTokenSecret });
    handleCatchBlockError(error);
  }

  // Fourth - the token is valid and we can access the
  // User inside.

  if (payload && typeof payload !== "string") {
    const [user, userError] = await handleAsyncWithArgs(dbConnection.getRepository(User).findOne, [payload.id]);

    if (userError) {
      logger.error("ERROR FINDING USER");
      handleCatchBlockError(userError);
    }

    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    // If the (refresh) token versions don't match the token is invalid.
    if (typeof payload !== "string" && user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    if (user) {
      // Reset our refresh token inside the secure cookie.
      sendRefreshToken({ config, res, user });

      const accessToken = createTokenData({ config, user, expireInt: 15, expireUnit: "s" });

      const refreshResponse: RefreshResponse = {
        ok: true,
        tokenData: {
          accessToken: accessToken.accessToken || "",
          expiresIn: accessToken.expiresIn,
          userId: accessToken.userId,
          version: accessToken.version,
        },
      };

      // In addition we return a new access token.
      return res.send(refreshResponse);
    } else {
      const errorMessage = `Expecting jwt payload to be of type 'object'`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // If we can't find a user send a failure case.
  res.status(401).send("Unable to verify token");
}
