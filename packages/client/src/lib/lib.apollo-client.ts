// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { concatPagination } from "@apollo/client/utilities";
import { setContext } from "@apollo/link-context";
import merge from "deepmerge";
import isEqual from "lodash/isEqual";
import { useMemo } from "react";
import { getAccessToken, setAccessToken } from "./lib.access-token";
import { errorLink, refreshLink, splitLink } from "./lib.apollo-links";
import { logger } from "./lib.logger";
import { requestAccessToken } from "./lib.request-server-access-token";
import { isServer } from "./utilities.is-server";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

let apolloClient;

function createApolloClient(
  _initialState,
  ssrCookie?: string,
  serverAccessToken?: string
) {
  logger.info("CREATE APOLLO CLIENT");
  logger.info({ serverAccessToken });

  return new ApolloClient({
    ssrMode: isServer(),
    link: ApolloLink.from([
      setContext(async (_, { headers = {} }) => {
        let newServerAccessToken;
        if (!getAccessToken()) {
          try {
            newServerAccessToken = await requestAccessToken(
              ssrCookie,
              "apollo-client"
            );
          } catch (error) {
            logger.error(error);
          }
          if (newServerAccessToken) {
            setAccessToken(newServerAccessToken);
          }
        }

        const accessToken = isServer()
          ? newServerAccessToken
          : getAccessToken();

        logger.info("AUTH HEADER WHILE SENDING - APOLLO CLIENT");
        logger.info({
          accessToken: accessToken ? accessToken : "not defined",
          isServer: isServer(),
        });
        return {
          headers: {
            ...headers,
            authorization: accessToken
              ? `Bearer ${accessToken}`
              : "public blank",
          },
        };
      }),
      refreshLink as any,
      errorLink,
      splitLink,
    ]),
    // link: errorLink.concat(authLink.concat(new RetryLink().concat(splitLink))),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            allPosts: concatPagination(),
          },
        },
      },
    }),
  });
}

export function initializeApollo(
  initialState = null,
  cookie?: string,
  accessToken?: string
): ApolloClient<NormalizedCacheObject> {
  logger.info("INITIALIZE APOLLO");
  logger.info({ accessToken });
  const _apolloClient: ApolloClient<NormalizedCacheObject> =
    apolloClient ?? createApolloClient(initialState, cookie, accessToken);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (isServer()) {
    //
    return _apolloClient;
  }
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function addApolloState(
  client: ApolloClient<NormalizedCacheObject>,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  pageProps: any
): any {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useApollo(
  pageProps: any,
  cookie?: string,
  accessToken?: string
): ApolloClient<NormalizedCacheObject> {
  logger.info("USE APOLLO");
  logger.info({ accessToken });
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(
    () => initializeApollo(state, cookie, accessToken),
    [state]
  );
  return store;
}
