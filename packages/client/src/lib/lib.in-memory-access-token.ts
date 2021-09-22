import { LoginMutation } from "../generated/graphql";
import { logger } from "./lib.logger";
import { isServer } from "./utilities.is-server";

export type InMemoryTokenType = LoginMutation["login"]["tokenData"] | null;
export type LocalStorageAccessToken = LoginMutation["login"]["tokenData"];

const ACCESS_TOKEN_KEY = "accessToken";

export function getToken(): LocalStorageAccessToken {
  // I'm not sure what to do with SSR since window
  // won't be defined
  if (isServer()) {
    return undefined;
  }
  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  let parsedToken: LocalStorageAccessToken;
  if (token) {
    parsedToken = JSON.parse(token);

    return parsedToken;
  } else {
    logger.info("VIEW THE PARSED TOKEN AND TOKEN - 'ELSE'");
    logger.info({ parsedToken, token });
    return undefined;
  }
  // return inMemoryToken;
}

export function setToken(token: LocalStorageAccessToken): void {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(token));
  // inMemoryToken = token;
}

export function isTokenExpired(token: LocalStorageAccessToken): boolean {
  const expired = !token || new Date() > new Date(token.expiresIn);
  return expired;
}
