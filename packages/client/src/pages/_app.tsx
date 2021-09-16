import { ChakraProvider } from "@chakra-ui/react";
import type Router from "next/dist/next-server/lib/router/router";
import * as React from "react";
import { useEffect } from "react";
import { Provider } from "urql";
import { storePathValues } from "../lib/get-pathname-values";
import { client } from "../lib/lib.urql-client";
import { getToken } from "../lib/lib.util.token-management";
import chakraTheme from "../styles/styles";

export type ThemeType = "dark" | "light";

interface MyAppProps {
  Component: any;
  pageProps: any;
  router: Router;
  apolloClient: any;
}

function MyApp({ Component, pageProps, router }: MyAppProps): JSX.Element {
  // Cheap history object kept in session storage.
  // Useful in Modal links to make back buttons when
  // router.back() effects aren't what you want.
  useEffect(() => storePathValues, [router.asPath]);

  const [authenticationState, setAuthenticationState] = React.useState<
    "isAuthenticated" | "isNotAuthenticated"
  >(() => {
    if (typeof getToken() === "string") {
      return "isAuthenticated";
    } else {
      return "isNotAuthenticated";
    }
  });

  const [theme, setTheme] = React.useState<ThemeType>("light");
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const content = Component.layout ? (
    <Component.layout>
      <Component
        {...pageProps}
        router={router}
        toggleTheme={toggleTheme}
        setAuthenticationState={setAuthenticationState}
      />
    </Component.layout>
  ) : (
    <Component {...pageProps} />
  );

  if (authenticationState === "isAuthenticated" || router.pathname === "/") {
    return (
      <Provider value={client}>
        <ChakraProvider resetCSS theme={chakraTheme}>
          {content}
        </ChakraProvider>
      </Provider>
    );
  } else {
    return (
      <Provider value={client}>
        <ChakraProvider resetCSS theme={chakraTheme}>
          <div>NAW, NOT AUTHENTICATED</div>
        </ChakraProvider>
      </Provider>
    );
  }
}

export default MyApp;
