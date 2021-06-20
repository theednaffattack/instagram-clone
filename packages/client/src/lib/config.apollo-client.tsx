import { useMemo } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split
} from "@apollo/client";
import {
  getMainDefinition,
  relayStylePagination
} from "@apollo/client/utilities";
import { setContext } from "@apollo/link-context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
// import Router from "next/router";

import { parseCookies } from "../lib/utilities.parse-cookies";
import { isServer } from "../lib/utilities.is-server";
import Router from "next/router";

const isProduction = process.env.NODE_ENV === "production";

let apolloClient: ApolloClient<NormalizedCacheObject>;

const httpLink = new HttpLink({
  uri: isProduction
    ? process.env.NEXT_PUBLIC_PRODUCTION_GQL_URI
    : process.env.NEXT_PUBLIC_DEVELOPMENT_GQL_URI,
  credentials: "include"
});

// Create a WebSocket link (browser only):
const wsLink = !isServer()
  ? new WebSocketLink(
      new SubscriptionClient(
        isProduction
          ? process.env.NEXT_PUBLIC_PRODUCTION_WEBSOCKET_URL!
          : process.env.NEXT_PUBLIC_DEVELOPMENT_WEBSOCKET_URL!,
        {
          lazy: true,
          reconnect: true
        }
      )
    )
  : null;

const splitLink = !isServer()
  ? split(
      // split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query);

        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink!,
      httpLink
    )
  : httpLink;

const authLink = setContext((_, { headers, req }) => {
  const token = parseCookies(req)[process.env.NEXT_PUBLIC_COOKIE_PREFIX!];

  return {
    headers: {
      ...headers,
      cookie: token ? `${process.env.NEXT_PUBLIC_COOKIE_PREFIX!}=${token}` : ""
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  // We don't want the home page to re-route so don't include
  // "createOrUpdateLikes" mutations to be filtered out and
  // redirected.
  const filteredAuthErrors =
    graphQLErrors &&
    graphQLErrors.filter(
      (error) =>
        error.message === "Not authenticated" &&
        !error.path?.includes("createOrUpdateLikes")
    );

  if (filteredAuthErrors && filteredAuthErrors.length > 0) {
    !isServer() &&
      Router.replace("/login?flash=You must be authenticated", "/login");
    return;
  }

  console.log("STILL GOING?");

  const filteredRoutes =
    graphQLErrors &&
    graphQLErrors?.filter((errorThing) => {
      const { path } = errorThing;
      const something = path && typeof path[0] === "string" ? path[0] : "";

      return something === "register";
    });

  if (
    (graphQLErrors && filteredRoutes && filteredRoutes.length < 1) ||
    (graphQLErrors && !filteredRoutes)
  ) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.warn(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

function createApolloClient() {
  return new ApolloClient({
    connectToDevTools: true,
    ssrMode: typeof window === "undefined",
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getGlobalPostsRelay: relayStylePagination(),
            getMessagesByThreadId: {
              merge(existing = {}, incoming: any, { mergeObjects }) {
                return mergeObjects(existing, incoming);
              }
            }
          }
        }
      }
    }),
    link: errorLink.concat(authLink.concat(new RetryLink().concat(splitLink)))
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
