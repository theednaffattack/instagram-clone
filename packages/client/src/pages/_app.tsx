import { ApolloProvider } from "@apollo/client";
import type Router from "next/dist/next-server/lib/router/router";
import * as React from "react";
import { ChakraProvider, Grid } from "@chakra-ui/react";

import chakraTheme from "../styles/styles";
import { useApollo } from "../lib/lib.apollo-client";

export type ThemeType = "dark" | "light";

interface MyAppProps {
  Component: any;
  pageProps: any;
  router: Router;
}

function MyApp({ Component, pageProps, router }: MyAppProps): JSX.Element {
  const apolloClient = useApollo(pageProps);

  const [theme, setTheme] = React.useState<ThemeType>("light");
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  // const Layout = Component.layout || ((children) => <>{children}</>);
  const Layout = Component.layout || TemporaryFakeLayout;

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider resetCSS theme={chakraTheme}>
        <Layout>
          <Component router={router} {...pageProps} toggleTheme={toggleTheme} />
        </Layout>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;

function TemporaryFakeLayout({ children }): JSX.Element {
  return (
    <Grid w="100%" height="100%">
      {children}
    </Grid>
  );
}
