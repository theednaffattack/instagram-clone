import type { Response } from "express";
import { ServerConfigProps } from "./config.build-config";
import { User } from "./entity.user";
import { createRefreshToken } from "./lib.authentication";
import { addDays } from "./lib.utilities.manipulate-time";

interface SendRefreshTokenProps {
  res: Response;
  config: ServerConfigProps;
  user: User;
}

export function sendRefreshToken({ res, config, user }: SendRefreshTokenProps) {
  const sevenDays = addDays(new Date(), 7);

  res.cookie(
    config.cookieName,
    // Note: Sigining the token with "REFRESH TOKEN secret"
    createRefreshToken({ config, user, expiresIn: "7d" }),
    {
      httpOnly: true,
      domain: config.domain,
      expires: sevenDays,
      secure: config.env === "production",
    }
  );
}
