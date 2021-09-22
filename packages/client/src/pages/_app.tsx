import { ChakraProvider } from "@chakra-ui/react";
import type Router from "next/dist/next-server/lib/router/router";
import * as React from "react";
import { useEffect } from "react";
import { Provider } from "urql";
import { BetterRouteGuard } from "../components/route-guard";
import { storePathValues } from "../lib/get-pathname-values";
import { client } from "../lib/lib.urql-client";
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

  const [theme, setTheme] = React.useState<ThemeType>("light");

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const { layout: ComponentLayout } = Component;

  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={chakraTheme}>
        <BetterRouteGuard>
          <ComponentLayout>
            <Component
              {...pageProps}
              router={router}
              toggleTheme={toggleTheme}
            />
          </ComponentLayout>
        </BetterRouteGuard>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
