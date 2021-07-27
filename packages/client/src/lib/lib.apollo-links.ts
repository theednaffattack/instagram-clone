import { HttpLink, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/link-context";
import Router from "next/router";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { getAccessToken } from "./lib.access-token";
import { isServer } from "./utilities.is-server";

const isProduction = process.env.NODE_ENV === "production";

export const httpLink = new HttpLink({
  uri: isProduction
    ? process.env.NEXT_PUBLIC_APOLLO_LINK_URI_PATH
    : process.env.NEXT_PUBLIC_DEVELOPMENT_GQL_URI,
  credentials: "include",
});

// Create a WebSocket link (browser only):
export const wsLink = !isServer()
  ? new WebSocketLink(
      new SubscriptionClient(
        isProduction
          ? process.env.NEXT_PUBLIC_APOLLO_LINK_WEBSOCKET_URI_PATH
          : process.env.NEXT_PUBLIC_DEVELOPMENT_WEBSOCKET_URL,
        {
          lazy: true,
          reconnect: true,
        }
      )
    )
  : null;

export const splitLink = !isServer()
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

export const authLink = setContext(async (_, { headers = {} }) => {
  const accessToken = getAccessToken();

  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

export const errorLink = onError(({ graphQLErrors, networkError }) => {
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
    !isServer() && Router.replace("/?error=You must be authenticated", "/");
    return;
  }

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
  if (networkError) console.error(`[Network error]: ${networkError}`);
});
