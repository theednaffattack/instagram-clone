import type { Response } from "express";
import { User } from "./entity.user";
import { createRefreshToken } from "./lib.authentication";
import { addDays } from "./lib.utilities.manipulate-time";

interface SendRefreshTokenProps {
  res: Response;
  config: any;
  user: User;
}

export function sendRefreshToken({ res, config, user }: SendRefreshTokenProps) {
  const sevenDays = addDays(7);

  res.cookie(
    config.cookieName,
    // Note: Sigining the token with "REFRESH TOKEN secret"
    createRefreshToken({ config, user, expiresIn: "7d" }),
    {
      httpOnly: true,
      expires: sevenDays,
    }
  );

  console.log("COOKIE WAS SET");
}
