import { ChakraProvider } from "@chakra-ui/react";
import type Router from "next/dist/next-server/lib/router/router";
import * as React from "react";
import { useEffect } from "react";
import AuthProvider from "../components/authentication-provider";
import { storePathValues } from "../lib/get-pathname-values";
import chakraTheme from "../styles/styles";

export type ThemeType = "dark" | "light";

interface MyAppProps {
  Component: any;
  pageProps: any;
  router: Router;
  apolloClient: any;
}

function MyApp({ Component, pageProps, router }: MyAppProps): JSX.Element {
  useEffect(() => storePathValues, [router.asPath]);

  const [theme, setTheme] = React.useState<ThemeType>("light");
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <AuthProvider>
      <ChakraProvider resetCSS theme={chakraTheme}>
        <Component router={router} {...pageProps} toggleTheme={toggleTheme} />
      </ChakraProvider>
    </AuthProvider>
  );
}

export default MyApp;
