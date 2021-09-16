import cookie from "cookie";
import { Response } from "express";

// @TODO:
// 1 -  Change cookie name from "refresh_token" to "icg" or other
//      project specific name.
// 2 -  Add refresh token expiry to ENV vars.

export function setRefreshTokenCookie(
  res: Response,
  refresh_token: string
): void {
  if (!process.env.REFRESH_TOKEN_EXPIRES) {
    throw new Error("env var process.env.REFRESH_TOKEN_EXPIRES is undefined!");
  }
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refresh_token", refresh_token, {
      httpOnly: true,
      maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRES, 10) * 60, // maxAge in second
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
  );
}
