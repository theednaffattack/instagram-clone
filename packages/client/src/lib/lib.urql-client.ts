import type { CombinedError } from "@urql/core";
import {
  cacheExchange,
  createClient,
  dedupExchange,
  errorExchange,
  fetchExchange,
  ssrExchange,
} from "@urql/core";
import { devtoolsExchange } from "@urql/devtools";
import { authExchange } from "@urql/exchange-auth";
import Router from "next/router";
import { getAuth } from "./lib.get-auth";
import { logger } from "./lib.logger";
import { addAuthToOperation } from "./lib.urql.add-auth-state-to-operation";
import { didAuthError } from "./lib.urql.did-auth-error";
import { willAuthError } from "./lib.urql.will-auth-error";
import { AuthState } from "./types";
import { isServer } from "./utilities.is-server";

const ssrCache = ssrExchange({ isClient: !isServer() });

const url = getGraphQlUrl();

const client = createClient({
  url,
  exchanges: [
    devtoolsExchange,
    errorExchange({
      onError: (error: CombinedError) => {
        logger.error("URQL CLIENT V1 - ERROR EXCHANGE");
        logger.error(error);
        // Re-direct any authentication related errors to home page.
        if (error.message === "[GraphQL] Not authenticated") {
          // On the client, simply re-direct
          if (!isServer()) {
            Router.push("/?error=Not authenticated");
          }
          // On the server we can't redirect without ctx!!!
        }
      },
    }),
    dedupExchange,
    cacheExchange,
    authExchange<AuthState>({
      getAuth,
      addAuthToOperation,
      didAuthError,
      willAuthError,
    }),
    ssrCache,
    fetchExchange,
  ],
  fetchOptions: () => {
    // // If we can find a token add it to headers.
    // const token = !isServer() ? getToken() : "";
    // return token
    // ? {
    //     headers: { Authorization: `Bearer ${token}` },
    //     credentials: "include",
    //   }
    // :
    return {
      credentials: "include",
    };
  },
});

export { client, ssrCache };

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
