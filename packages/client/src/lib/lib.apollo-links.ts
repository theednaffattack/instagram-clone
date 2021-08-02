import { HttpLink, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/link-context";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import { JwtPayload } from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import Router from "next/router";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { getAccessToken, setAccessToken } from "./lib.access-token";
import { logger } from "./lib.logger";
import { isServer } from "./utilities.is-server";

const isProduction = process.env.NODE_ENV === "production";

export const httpLink = new HttpLink({
  // headers,
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

export const refreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();

    if (!token) {
      logger.info({ token }, "TOKEN IS UNDEFINED - REFRESH LINK");
      return true;
    }

    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      logger.info({ token, exp }, "VIEW DECODED TOKEN INFO - REFRESH LINK");
      const expires = new Date(exp * 1000);

      const dateTimeFormat = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      logger.info({
        expiration: dateTimeFormat.format(expires),
        now: dateTimeFormat.format(new Date()),
      });
      // If the time now is later than the expiration time
      // return false. The token is not valid and not undefined.
      if (new Date() >= expires) return false;
      // If the date now is earlier than expiration (has not expired)
      // return true. The token is valid and not undefined.s
      return true;
    } catch {
      // In case of error while decoding the token, return false.
      // The token is not valid and possibly undefined (The JWT may be
      // malformed or some other unknown error).
      return false;
    }
  },
  fetchAccessToken: async () => {
    const url =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_REFRESH_URL
        : process.env.NEXT_PUBLIC_DEV_REFRESH_URL;
    logger.info("FETCH RUNNING");
    return fetch(url, { method: "POST", credentials: "include" });
  },
  handleFetch: (accessToken: string) => {
    setAccessToken(accessToken);
    // TODO: I might want to consider changing the expireTime
    // const accessTokenDecrypted = jwtDecode<JwtPayload>(accessToken);
    // setExpiresIn(parseExp(accessTokenDecrypted.exp).toString());
  },
  // handleResponse: (operation, accessTokenField) => (response) => any,
  handleError: (err: Error) => {
    // full control over handling token fetch Error
    logger.warn("Your refresh token is invalid. Please try to re-login");
    logger.error(err);

    // TODO: custom action here
    // setAccesstoken(null) ???;
    // multi-window logout;
    // send the logout function???
    // redirect to login with a flash message
    // user.logout();
  },
});

/**
 * Sets the authorization header on outbound requests
 */
export const authLink = setContext(async (_, { headers = {} }) => {
  const accessToken = getAccessToken();
  logger.info("AUTH HEADER WHILE SENDING");
  logger.info({ headers, accessToken });
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
    !isServer() &&
      Router.replace(
        `/?error=You must be authenticated${
          Router.pathname !== "/" ? "&next=" + Router.pathname : null
        }`
      );
    return;
  }

  // Try to filter out errors that have a path attribute
  // Not sure why we're testing the first element for its type
  const filteredRoutes =
    graphQLErrors &&
    graphQLErrors?.filter((errorThing) => {
      const { path } = errorThing;
      const something = path && typeof path[0] === "string" ? path[0] : "";

      return something === "register";
    });

  // If there are no filtered routes or if it's an empty array somehow.
  if (
    (graphQLErrors && filteredRoutes && !filteredRoutes.length) ||
    (graphQLErrors && !filteredRoutes)
  ) {
    graphQLErrors.map(({ message, locations, path }) =>
      logger.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }

  // remove cached token on 401 from the server
  if (
    networkError &&
    "statusCode" in networkError &&
    networkError.name === "ServerError" &&
    networkError.statusCode === 401
  ) {
    setAccessToken(null);
  }

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

// Now handled by apollo-token-refresh-link
// async function requestAccessToken(): Promise<void> {
//   // We only do this for the initial sign-in.
//   if (getAccessToken()) return;

//   // I think we only want this on the client (see if settings). It'd be
//   // much better to check for SSR somehow. Actually why wouldn't I have this
//   // server-only for refresh situations?
//   // if (!isServer()) {
//   const url =
//     process.env.NODE_ENV === "production"
//       ? process.env.NEXT_PUBLIC_REFRESH_URL
//       : process.env.NEXT_PUBLIC_DEV_REFRESH_URL;

//   const requestBody = {};
//   const axiosConfig: AxiosRequestConfig = { withCredentials: true };

//   let res;
//   try {
//     res = await axios.post(url, requestBody, axiosConfig);
//   } catch (err) {
//     logger.error(
//       err,
//       "ERROR REQUESTING ACCESS TOKEN AND SETTING REFRESH TOKEN COOKIE"
//     );
//   }

//   if (res.data.ok) {
//     setAccessToken(res.data.accessToken);
//     return res.data.accessToken;
//   } else {
//     // I set access token to "public" because setting it to an
//     // empty string is confusing elsewhere in the application.
//     setAccessToken("public");
//   }
//   // }
// }
