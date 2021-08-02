import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import type Router from "next/dist/next-server/lib/router/router";
import * as React from "react";
import { useEffect } from "react";
import { storePathValues } from "../lib/get-pathname-values";
import { useApollo } from "../lib/lib.apollo-client";
import chakraTheme from "../styles/styles";

export type ThemeType = "dark" | "light";

interface MyAppProps {
  Component: any;
  pageProps: any;
  router: Router;
}

function MyApp({ Component, pageProps, router }: MyAppProps): JSX.Element {
  useEffect(() => storePathValues, [router.asPath]);

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
      <Component.layout router={router}>
        <Component router={router} {...pageProps} toggleTheme={toggleTheme} />
      </Component.layout>
    );
  } else {
    content = (
      <>
        <Component router={router} {...pageProps} toggleTheme={toggleTheme} />
      </>
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider resetCSS theme={chakraTheme}>
        {content}
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;

// function LoadingScreen({
//   loading,
// }: {
//   loading: "isLoading" | "hasLoaded" | "notRequested" | "responseEmpty";
// }): JSX.Element {
//   return (
//     <Flex flexDirection="column" justifyContent="center" alignItems="center">
//       <p>loading...</p>
//       <p>{loading}</p>
//     </Flex>
//   );
// }
