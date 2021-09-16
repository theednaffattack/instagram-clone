import React, { ReactChild, ReactChildren } from "react";
import { useMeQuery } from "../generated/graphql";
import { useIsAuth } from "../lib/utilities.hooks.useIsAuth";
// import { isServer } from "../lib/utilities.is-server";
import { Wrapper } from "./box-wrapper";
import { NavbarAuthenticated } from "./navbar-authenticated";

type LayoutProps = {
  children: ReactChild | ReactChildren;
};

export function Layout({ children }: LayoutProps): JSX.Element {
  // const router = useRouter();
  useIsAuth();
  const [{ data: dataMe, fetching: loadingMe }] = useMeQuery({
    // Do not run this query on the server.
    // pause: isServer()
  });

  // for now show a loading state
  if (loadingMe) {
    return (
      <>
        <NavbarAuthenticated dataMe={dataMe} loadingMe={loadingMe} />
        <Wrapper>loading...</Wrapper>
      </>
    );
  }

  // Below is only useful for client routing.
  // Something will need to be prepared to
  // render something else on the server to prevent
  // the first-load flash of content.
  return (
    <>
      <NavbarAuthenticated dataMe={dataMe} loadingMe={loadingMe} />
      <Wrapper>
        {!loadingMe && !dataMe?.me ? "unexpected state" : children}
      </Wrapper>
    </>
  );
}
