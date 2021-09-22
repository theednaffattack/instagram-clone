import type {
  TypedDocumentNode,
  OperationContext,
  OperationResult,
} from "@urql/core";
import type { DocumentNode } from "graphql";
import Router from "next/router";

import { LogoutDocument } from "../generated/graphql";
import { getToken, setToken } from "./lib.in-memory-access-token";
import { logger } from "./lib.logger";
import { requestAccessToken } from "./lib.request-access-token";
import type { AuthState } from "./types";
import { isServer } from "./utilities.is-server";

interface RefreshResponse {
  ok: boolean;
  tokenData: {
    accessToken: string;
    expiresIn: Date;
    userId: string;
    version: number;
  };
}

interface GetAuthParams {
  authState: AuthState | null;
  // eslint-disable-next-line @typescript-eslint/ban-types
  mutate<Data = any, Variables extends object = {}>(
    query: DocumentNode | TypedDocumentNode<Data, Variables> | string,
    variables?: Variables,
    context?: Partial<OperationContext>
  ): Promise<OperationResult<Data>>;
}

export async function getAuth({
  authState,
  mutate,
}: GetAuthParams): Promise<AuthState | null> {
  // If we're on the client and authState doesn't
  // exist we want to fetch the token. Since
  // I'm keeping it in a global var this will probably
  // fail on HMR and refreshes.
  if (!authState) {
    const token = getToken();
    // logger.info("INSIDE GET AUTH");
    // logger.info({ token });
    if (!token) {
      return null;
    }
    if (token) {
      return { authState: token };
    }

    return null;
  }

  // If there is an auth state try refreshing
  const token = getToken();
  // logger.info({
  //   newDate: new Date(),
  //   tokenExpiresIn: new Date(token?.expiresIn),
  //   compare: new Date() > new Date(token?.expiresIn),
  // });
  if (token && new Date() > new Date(token?.expiresIn)) {
    let result: RefreshResponse;
    try {
      // Below we request a new access token
      // Our backend reads our refresh token stored in a cookie.
      result = await requestAccessToken();
    } catch (error) {
      logger.error("ERROR FETCHING REFRESH TOKEN");
      logger.error({ error });
      if (error instanceof Error) {
        throw error;
      }
      if (typeof error === "string") {
        throw new Error(error);
      }
      throw new Error(JSON.stringify(error));
    }

    // logger.info("VIEW REFRESH RESPONSE");
    // logger.info(result);

    // If we successfully get a new access token
    if (result.tokenData?.accessToken) {
      // Client-side set the token
      if (!isServer()) {
        // set access token to local storage
        setToken(result.tokenData);

        return {
          authState: result.tokenData,

          // {
          //   accessToken: result.data.refreshLogin.token,
          //   expiresIn: result.data.refreshLogin.expiry,
          // },
        };
      }
      // If it's not the server return null automatically
      return null;
    }
    // If we didn't get a new access token (via refresh token in cookie),
    // return null
    return null;
  }

  // This is where auth has gone wrong and we need to clean up
  //  and redirect to a login page
  try {
    const { data, error } = await mutate(LogoutDocument);

    if (error) {
      logger.error("ERROR REQUESTING LOGOUT FROM SERVER.");
      logger.error(error);
      throw error;
    }

    const successMessage = "You have been logged out.";

    // If we got a response and we're on the client
    // re-route with a success message.
    if (data && !isServer()) {
      Router.push(`/?message=${successMessage}`);
    }
  } catch (err) {
    logger.error("ERROR ATTEMPTING LOGOUT MUTATION");
    logger.error({ error: err });
    if (err instanceof Error) {
      throw err;
    }
    if (typeof err === "string") {
      throw new Error(err);
    }
    throw new Error(JSON.stringify(err));
  }

  return null;
}
