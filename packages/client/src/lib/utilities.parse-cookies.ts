import { NextPageContext } from "next";
import cookie from "cookie";

import { isServer } from "./utilities.is-server";

type ParseCookieReturn = { [key: string]: string };

export function parseCookies(
  req?: NextPageContext["req"],
  options = {}
): ParseCookieReturn {
  return cookie.parse(
    isServer() && req
      ? req.headers.cookie
        ? req.headers.cookie
        : document.cookie
      : "",
    options
  );
}
