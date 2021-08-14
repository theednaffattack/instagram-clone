import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import {
  getMainDefinition,
  relayStylePagination,
} from "@apollo/client/utilities";
import { setContext } from "@apollo/link-context";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import fetch from "isomorphic-unfetch";
import type { JwtPayload } from "jwt-decode";
import jwtDecode from "jwt-decode";
import { useMemo } from "react";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { useAuth } from "../components/authentication-provider";
import { LoginPage } from "../components/login-page";
import { APOLLO_STATE_PROP_NAME } from "./lib.apollo-client";
import { logger } from "./lib.logger";
import { isServer } from "./utilities.is-server";

const initApolloClient = (
  initialState = {},
  token: string,
  userId: string,
  setAuthToken: (token: string) => void
) => {
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getGlobalPostsRelay: relayStylePagination(),
        },
      },
    },
  }).restore(initialState);

  const httpLink = createHttpLink({
    uri:
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_PRODUCTION_GQL_URI
        : process.env.NEXT_PUBLIC_DEVELOPMENT_GQL_URI,
    fetch,
    credentials: "include",
  });

  const authLink = setContext((_, { headers }) =>
    // return the headers to the context so httpLink can read them
    ({
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        userid: userId,
      },
    })
  );

  const wsLink = !isServer()
    ? new WebSocketLink(
        new SubscriptionClient(
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_APOLLO_LINK_WEBSOCKET_URI_PATH
            : process.env.NEXT_PUBLIC_DEVELOPMENT_WEBSOCKET_URL,
          {
            lazy: true,
            reconnect: true,
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
        wsLink,
        httpLink
      )
    : httpLink;

  const refreshLink = new TokenRefreshLink({
    accessTokenField: "accessToken",
    // No need to refresh if token exists and is still valid
    isTokenValidOrUndefined: () => {
      // No need to refresh if we don't have a userId
      if (!userId) {
        return true;
      }
      // No need to refresh if token exists and is valid
      if (token && jwtDecode<JwtPayload>(token)?.exp * 1000 > Date.now()) {
        return true;
      }
    },
    fetchAccessToken: async () => {
      const url =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_REFRESH_URL
          : process.env.NEXT_PUBLIC_DEV_REFRESH_URL;

      if (!userId) {
        // no need to refresh if userId is not defined
        return null;
      }

      // Use fetch to access the refreshUserToken mutation
      let response;
      try {
        response = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ data: { from: "lib.apollo-client-v2.ts" } }),
        });
      } catch (error) {
        logger.error("ERROR FETCHING REFRESH TOKEN");
        logger.error(error);
      }

      let resJson;
      try {
        resJson = await response.json();
      } catch (error) {
        logger.error("ERROR FETCHING REFRESH TOKEN");
        logger.error(error);
      }

      return resJson;
    },
    handleFetch: (newToken) => {
      // save new authentication token to state
      setAuthToken(newToken);
    },
    handleResponse: (_operation, _accessTokenField) => (response) => {
      if (!response) return { accessToken: null };
      token = response[_accessTokenField]; // <--- This line
      return { accessToken: token };
    },
    handleError: (error) => {
      console.error("Cannot refresh access token:", error);
    },
  });

  const client = new ApolloClient({
    ssrMode: false,
    link: (refreshLink as any).concat(authLink).concat(splitLink),
    cache,
  });
  return client;
};

type WithApolloReturn = ({
  apolloClient,
  apolloState,
  ...pageProps
}: {
  [x: string]: any;
  apolloClient: any;
  apolloState: any;
}) => JSX.Element;

type What = { layout?: any };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const withApollo = (PageComponent: any): WithApolloReturn & What => {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    const { authState, setAuthToken } = useAuth();

    // useEffect(() => {
    //   if (!authState.userId) {
    //     logger.info("RE-ROUTING IN USE-EFFECT IN WITH APOLLO");
    //     pageProps.router.push("/?error=Knicks asset");
    //   }
    // }, [authState.userId]);
    logger.info(authState);
    const client =
      apolloClient ||
      initApolloClient(
        apolloState,
        authState?.token,
        authState?.userId,
        setAuthToken
      );

    let content;

    if (authState && authState?.userId) {
      content = (
        <PageComponent.layout>
          <PageComponent {...pageProps} />
        </PageComponent.layout>
      );
    } else {
      content = <LoginPage />;
    }

    return (
      <ApolloProvider client={client}>
        {/* <PageComponent {...pageProps} /> */}
        {content}
      </ApolloProvider>
    );
  };

  return WithApollo;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useApollo(
  pageProps: any,
  userId?: string,
  accessToken?: string
): ApolloClient<NormalizedCacheObject> {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(
    () =>
      initApolloClient(state, accessToken, userId, () =>
        // eslint-disable-next-line no-console
        console.log("LOVABLE HOOPERS")
      ),
    [state]
  );
  return store;
}

export default withApollo;
