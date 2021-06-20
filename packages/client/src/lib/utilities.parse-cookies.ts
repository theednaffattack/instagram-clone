import { NextPageContext } from "next";
import cookie from "cookie";

import { isServer } from "./utilities.is-server";

export function parseCookies(req?: NextPageContext["req"], options = {}) {
  return cookie.parse(
    isServer() && req
      ? req.headers.cookie
        ? req.headers.cookie
        : document.cookie
      : "",
    options
  );
}
