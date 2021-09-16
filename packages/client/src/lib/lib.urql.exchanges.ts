import { errorExchange, makeOperation, Exchange } from "@urql/core";
import { authExchange } from "@urql/exchange-auth";
import { auth, getToken, isTokenExpired, setToken } from "./lib.auth.token";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { logger } from "./lib.logger";

import { request } from "./lib.request";
import { AuthState } from "./types";
import { isServer } from "./utilities.is-server";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function customAuthExchange(ctx: any): Exchange {
  return authExchange<AuthState>({
    addAuthToOperation: function addAuthToOperation({ authState, operation }) {
      if (
        !authState ||
        !authState.authState ||
        !authState.authState.accessToken
      ) {
        return operation;
      }
      const fetchOptions =
        typeof operation.context.fetchOptions === "function"
          ? operation.context.fetchOptions()
          : operation.context.fetchOptions || {};

      return makeOperation(operation.kind, operation, {
        ...operation.context,
        fetchOptions: {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            Authorization: `Bearer ${authState.authState.accessToken}`,
          },
        },
      });
    },

    didAuthError: ({ error }) => {
      // check if the error was an auth error (this can be implemented in various ways, e.g. 401 or a special error code)
      return error.graphQLErrors.some(
        (e) => e.extensions?.code === "invalid-jwt"
      );
    },

    getAuth: async ({ authState }) => {
      // for initial launch, fetch the auth state from storage (local storage, async storage etc)
      logger.info("GET AUTH");
      logger.info({ authState });
      if (!authState) {
        // const token = getToken() || (await auth(ctx));
        let token;
        if (isServer()) {
          token = getToken();
        } else {
          try {
            token = await auth(ctx);
          } catch (error) {
            logger.error("ERROR GRABBING TOKEN");
            handleCatchBlockError(error);
          }
        }
        if (token) {
          // return { token: token.jwt_token };
          logger.info(token, "VIEW TOKEN IN GET AUTH - INITIAL LAUNCH");
          return {
            authState: {
              refreshToken: "",
              token: "",
              expiry: new Date(),
              __typename: "TokenData",
            },
          };
        }
        return null;
      }

      /**
       * the following code gets executed when an auth error has occurred
       * we should refresh the token if possible and return a new auth state
       * If refresh fails, we should log out
       **/

      // if your refresh logic is in graphQL, you must use this mutate function to call it
      // if your refresh logic is a separate RESTful endpoint, use fetch or similar
      setToken(null);
      let result;
      try {
        result = await auth(ctx);
      } catch (error) {
        logger.error("ERROR IN GET AUTH");
        handleCatchBlockError(error);
      }
      logger.info("VIEW TOKEN IN GET AUTH - AFTER AUTH ERROR");
      logger.info({ result });
      // if (result?.jwt_token) {
      if (result) {
        // return the new tokens
        // result.jwt_token
        logger.info(
          result,
          "VIEW TOKEN IN GET AUTH - AFTER REQUESTING NEW TOKEN"
        );

        return {
          authState: { refreshToken: "", token: "", expiry: new Date() },
        };
      }

      return null;
    },

    willAuthError: ({ authState }) => {
      // e.g. check for expiration, existence of auth etc
      if (!authState || isTokenExpired()) return true;
      return false;
    },
  });
}

export function customErrorExchange(): Exchange {
  return errorExchange({
    onError: (error) => {
      const { graphQLErrors } = error;
      // we only get an auth error here when the auth exchange had attempted to refresh auth and getting an auth error again for the second time
      const isAuthError = graphQLErrors.some(
        (e) => e.extensions?.code === "invalid-jwt"
      );
      if (isAuthError) {
        // clear storage, log the user out etc
        // your app logout logic should trigger here
        logger.info("errorExchange", "logout");
        request("/api/logout", {
          credentials: "include",
          mode: "same-origin",
        });
      }
    },
  });
}
