// Adapted from: https://gist.github.com/kitten/6050e4f447cb29724546dd2e0e68b470
import type { CombinedError, ExchangeInput, Operation } from "@urql/core";
import {
  createClient,
  dedupExchange,
  errorExchange,
  fetchExchange,
  ssrExchange,
} from "@urql/core";
import { devtoolsExchange } from "@urql/devtools";
import type { Cache, QueryInput, Variables } from "@urql/exchange-graphcache";
import { cacheExchange } from "@urql/exchange-graphcache";
import { relayPagination } from "@urql/exchange-graphcache/extras";
import { retryExchange } from "@urql/exchange-retry";
import jwtDecode, { JwtPayload } from "jwt-decode";
import Router from "next/router";
import { Exchange } from "urql";
import {
  filter,
  fromPromise,
  fromValue,
  map,
  merge,
  mergeMap,
  onPush,
  pipe,
  share,
  takeUntil,
} from "wonka";
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";
import { getToken, setToken } from "./lib.in-memory-access-token";
import type { InMemoryTokenType } from "./lib.in-memory-access-token";
import { logger } from "./lib.logger";
import { requestAccessToken } from "./lib.request-access-token";
// import { getToken, removeToken } from "./lib.util.token-management";
import { isServer } from "./utilities.is-server";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";

interface MyOperation extends Operation {
  operationName: string;
}

const ssrCache = ssrExchange({ isClient: !isServer() });

function addTokenToOperation(operation: MyOperation, token: string) {
  const fetchOptions =
    typeof operation.context.fetchOptions === "function"
      ? operation.context.fetchOptions()
      : operation.context.fetchOptions || {};

  return {
    ...operation,
    operationName: operation.operationName,
    context: {
      ...operation.context,
      fetchOptions: {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          Authorization: `Bearer ${token}`,
        },
      },
    },
  };
}

/**
  This exchange performs authentication and is a recipe.
  The `getToken` function gets a token, e.g. from local storage.
  The `isTokenExpired` function checks whether we need to refresh.
  The `refreshToken` function calls fetch to get a new token and stores it in local storage.
  */
const authExchange =
  (): Exchange =>
  ({ forward }: ExchangeInput) => {
    let refreshTokenPromise: Promise<any> | null = null;

    return (ops$) => {
      // We share the operations stream
      const sharedOps$ = pipe(ops$, share);

      const withToken$ = pipe(
        sharedOps$,
        // Filter by non-teardowns
        filter((operation: any) => operation.operationName !== "teardown"),
        mergeMap((operation) => {
          // check whether the token is expired
          const token = getToken();

          // If the token doesn't exist, or
          // if the token is a blank string.
          if (!token) {
            // On the client, re=route (TODO: change this error message)
            if (!isServer()) {
              Router.push("/?error=No authentication token");
            } else {
              logger.info("WANT TO RE-ROUTE BUT I'M ON THE SERVER");
              // return fromValue(true);
            }
          }

          let isExpired;
          try {
            isExpired = refreshTokenPromise || (token && isTokenExpired(token));
          } catch (error) {
            handleCatchBlockError(error);
          }

          // If it's not expired then just add it to the operation immediately
          if (token && !isExpired && token.accessToken) {
            return fromValue(addTokenToOperation(operation, token.accessToken));
          }

          // If it's expired and we aren't refreshing it yet, start refreshing it
          if (isExpired && !refreshTokenPromise) {
            refreshTokenPromise = requestAccessToken(); // we share the promise
          }

          const { key } = operation;
          // Listen for cancellation events for this operation
          const teardown$ = pipe(
            sharedOps$,
            filter(
              (op: any) => op.operationName === "teardown" && op.key === key
            )
          );

          return pipe(
            fromPromise(
              refreshTokenPromise !== null
                ? refreshTokenPromise
                : new Promise((resolve) => resolve("fake refresh string"))
              // Above SHOULD be an impossible state
              // Maybe reject here instead? This entire function expects
              // to return a token. It seems better to throw.
            ),
            // Don't bother to forward the operation, if it has been cancelled
            // while we were refreshing
            takeUntil(teardown$),
            map((token: string) => {
              refreshTokenPromise = null; // reset the promise variable
              return addTokenToOperation(operation, token);
            })
          );
        })
      );

      // We don't need to do anything for teardown operations
      const withoutToken$ = pipe(
        sharedOps$,
        filter((operation: any) => operation.operationName === "teardown")
      );

      return pipe(
        merge([withToken$, withoutToken$]),
        forward,
        onPush((result: any) => {
          if (
            result.error &&
            result.error
              .networkError /* TODO: also add a check for 401 Unauthorized here! */
          ) {
            setToken(null);
            // invalidateToken(getToken()); // here you'd invalidate your local token synchronously
            // this is so our pretend `isTokenExpired()` function returns `true` next time around
          }
        })
      );
    };
  };

// Then you can combine this with the retryExchange

export const client = createClient({
  url: getGraphQlUrl(),
  exchanges: [
    devtoolsExchange,
    errorExchange({
      onError: (error: CombinedError) => {
        logger.error("VIEW COMINATION ERROR");
        logger.error(error);
        // Re-direct any authentication related errors to home page.
        if (error.message === "[GraphQL] Not authenticated") {
          if (!isServer()) {
            Router.push("/?error=Not authenticated");
          } else {
            logger.error("ERROR EXCHANGE - SSR");
          }
        }
      },
    }),
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result, _args, cache, _info) => {
            /**
             * 
            Use this function instead of 'cache.updateQuery'
             */
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result as LoginMutation,
              (result, query) => {
                // If we sense errors, do not update
                if (result.login.errors) {
                  return query;
                } else {
                  // Otherwise update 'me' in cache.
                  return {
                    me: { id: result?.login?.tokenData?.userId },
                  };
                }
              }
            );
          },
          register: (_result, _args, cache, _info) => {
            // Use this function instead of 'cache.updateQuery'
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result as RegisterMutation,
              (result, query) => {
                // If we sense errors, do not update
                if (result.register.errors) {
                  return query;
                } else {
                  // Otherwise update 'me' in cache.
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
          getGlobalPostsRelay: relayPagination(),
        },
        Subscription: {
          GetGlobalPostsRelay: (_result, _args, _cache, _info) => {
            // ...
          },
        },
      },
    }),
    retryExchange({
      /* optional options */
      retryIf: (error) => {
        logger.error("INSIDE RETRY EXCHANGE - VIEW ERROR");
        logger.error(error);
        return !!(error.graphQLErrors.length > 0 || error.networkError);
      },
    }),
    authExchange(),
    ssrCache,
    fetchExchange,
  ],
  // fetchOptions: () => {
  //   // If we can find a token add it to headers.
  //   const token = !isServer() ? getToken() : "";
  //   return token
  //     ? {
  //         headers: { Authorization: `Bearer ${token}` },
  //         credentials: "include",
  //       }
  //     : {
  //         credentials: "include",
  //       };
  // },
});

/**
  This function checks for token expiration.
  If this function returns `true` it means the token is expired.
  */
function isTokenExpired(token: InMemoryTokenType): boolean {
  if (!token || !token.accessToken) {
    logger.error(`Token is undefined or of the wrong type: ${token}`);
    throw new Error("Not Authenticated");
    // return true;
  }
  try {
    const { exp } = jwtDecode<JwtPayload>(token.accessToken);

    if (exp && Date.now() >= exp * 1000) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    // If any kind of error received call it expired (Erroring isn't helpful here)
    logger.error("ERROR DECODING TOKEN");
    handleCatchBlockError(error);
    return true;
    // throw new Error("Not Authenticated");
  }
}

/**
 *
 * @param cache The cache provided by `@urql/exchange-graphcache`.
 * @param qi
 * @param result
 * @param fn
 * @returns The Query Result provided in generics.
 */
function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: Result,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery<Query, Variables>(qi, (data) => {
    if (data) {
      return fn(result, data);
    } else {
      return null;
    }
  });
}

function getGraphQlUrl(): string {
  let graphQlUrl: string;
  switch (process.env.NODE_ENV) {
    case "development":
    case "test":
      graphQlUrl =
        process.env.NEXT_PUBLIC_DEVELOPMENT_GQL_URI ?? "dev_gql_uri_undefined";
      break;

    // It seemed easier to default to production
    // settings
    default:
      graphQlUrl =
        process.env.NEXT_PUBLIC_PRODUCTION_GQL_URI ?? "prod_gql_uri_undefined";
      break;
  }
  return graphQlUrl;
}
