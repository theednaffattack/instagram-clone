import { ApolloProvider } from "@apollo/client";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import axios from "axios";
import type Router from "next/dist/next-server/lib/router/router";
import * as React from "react";
import { useEffect, useState } from "react";
import AccessDenied from "../components/access-denied";
import { getAccessToken, setAccessToken } from "../lib/lib.access-token";
import { useApollo } from "../lib/lib.apollo-client";
import { useHasMounted } from "../lib/lib.hooks.has-mounted";
import { logger } from "../lib/lib.logger";
import chakraTheme from "../styles/styles";

export type ThemeType = "dark" | "light";

interface MyAppProps {
  Component: any;
  pageProps: any;
  router: Router;
}

function MyApp({ Component, pageProps, router }: MyAppProps): JSX.Element {
  const [loadingRefreshToken, setLoadingRefreshToken] =
    useState<"isLoading" | "hasLoaded" | "notRequested" | "responseEmpty">(
      "isLoading"
    );

  const mounted = useHasMounted();
  const url =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_REFRESH_URL
      : process.env.NEXT_PUBLIC_DEV_REFRESH_URL;
  useEffect(() => {
    // Set global access token
    const accessToken = getAccessToken();

    logger.info({ accessToken }, "ACCESS TOKEN - USE EFFECT - _APP");
    const requestBody = {
      token: accessToken,
    };

    const axiosConfig = { withCredentials: true };

    axios
      .post(url, requestBody, axiosConfig)
      .then((response) => {
        logger.info(response, "VIEW RESPOSNE");

        // If we already have a cookie with our token in it
        // the server will respond with an access token.
        // TODO: check token expiration on the server.
        if (response.data.ok && response.data.accessToken) {
          setAccessToken(response.data.accessToken);
          setLoadingRefreshToken("hasLoaded");
          return;
        }

        // If we are totally logged out then...
        if (response.data.ok === false) {
          router.push("/?error=Not authenticated", "/");
          // setLoadingRefreshToken("responseEmpty");
        }
        logger.info(response, "WAIT WHAT IS RESPONSE?");
      })
      .catch((err) => logger.error(err, "ERROR REQUESTING REFRESH TOKEN"));
  }, [mounted]);

  const apolloClient = useApollo(pageProps);

  const [theme, setTheme] = React.useState<ThemeType>("light");
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  let content;

  if (Component.layout) {
    content = (
      <Component.layout>
        <AccessDenied message={router.query.error as string} />
        <Component router={router} {...pageProps} toggleTheme={toggleTheme} />
      </Component.layout>
    );
  } else {
    content = (
      <>
        <AccessDenied message={router.query.error as string} />
        <Component router={router} {...pageProps} toggleTheme={toggleTheme} />
      </>
    );
  }

  const showLoadingScreen =
    loadingRefreshToken === "isLoading" && router.pathname !== "/";

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider resetCSS theme={chakraTheme}>
        {showLoadingScreen ? (
          <LoadingScreen loading={loadingRefreshToken} />
        ) : (
          content
        )}
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;

function LoadingScreen({
  loading,
}: {
  loading: "isLoading" | "hasLoaded" | "notRequested" | "responseEmpty";
}): JSX.Element {
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <p>loading...</p>
      <p>{loading}</p>
    </Flex>
  );
}
