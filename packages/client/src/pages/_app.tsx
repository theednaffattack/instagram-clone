import * as React from "react";

export type ThemeType = "dark" | "light";

interface MyAppProps {
  Component: any;
  pageProps: any;
}

function MyApp({ Component, pageProps }: MyAppProps): JSX.Element {
  const [theme, setTheme] = React.useState<ThemeType>("light");
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  // const Layout = Component.layout || ((children) => <>{children}</>);
  const Layout = Component.layout || Component;

  return (
    <Layout>
      <Component {...pageProps} toggleTheme={toggleTheme} />
    </Layout>
  );
}

export default MyApp;
