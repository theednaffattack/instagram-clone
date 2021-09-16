import Router from "next/router";
import { logger } from "./lib.logger";

import { request } from "./lib.request";
import { setRefreshTokenCookie } from "./lib.set-refresh-token-cookie";

let inMemoryToken: CustomTokenType | null;

interface CustomTokenType {
  accessToken: string;
  expiry: Date;
}

export function getToken(): CustomTokenType | null {
  return inMemoryToken || null;
}

export function setToken(token: CustomTokenType | null): void {
  inMemoryToken = token;
}

export function isTokenExpired(): boolean {
  const expired = !inMemoryToken || new Date() > new Date(inMemoryToken.expiry);
  return expired;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function auth(ctx: any): Promise<CustomTokenType | null> {
  logger.info({ ctx: ctx ? true : false }, "[ auth ] ctx ?");
  if (ctx?.token) {
    return ctx.token;
  }
  if (inMemoryToken) {
    return inMemoryToken;
  }

  const cookieHeader = ctx?.req ? { Cookie: ctx.req.headers.cookie } : {};
  if (
    ctx?.res &&
    !ctx.res.writableEnded &&
    !/refresh_token/.test(cookieHeader.Cookie)
  ) {
    logger.info("[ auth ] no cookie found -> redirect to login");
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
    return null;
  }
  try {
    logger.info("[auth] refresh token");
    const tokenData = await request("a_fake_url", {
      body: { from: "lib.auth-token.ts" },
      credentials: "include",
      headers: {
        "Cache-Control": "no-cache",
        ...cookieHeader,
      },
      // mode: "",
    });
    // for ServerSide call, we need to set the Cookie header
    // to update the refresh_token value
    if (ctx?.res) {
      setRefreshTokenCookie(ctx.res, tokenData.refresh_token);
      // we also store token in context (this is probably a bad idea b)
      // to reuse it and avoid refresh token twice
      ctx.token = tokenData;
    }
    inMemoryToken = { ...tokenData };
    logger.info(
      { inMemoryToken: inMemoryToken ? "true" : "false" },
      "[auth] token"
    );
    return inMemoryToken;
  } catch (error) {
    logger.error({ error }, "[ auth ] refreshToken error ");

    // we are on server side and its response is not ended yet
    if (ctx?.res && !ctx.res.writableEnded) {
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();
    } else if (ctx && !ctx.req) {
      // if we are on the client
      Router.push("/");
      return null;
    }
  }
  return null;
}
