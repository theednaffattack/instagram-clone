import router from "next/router";
import React, { useEffect } from "react";
import { ErrorMessage } from "../components/error-message";
import { AppLayout } from "../components/layout.app";
import { useLogoutMutation } from "../generated/graphql";
import { setToken } from "../lib/lib.in-memory-access-token";
import { logoutAllTabs } from "../lib/logoutAllTabs";

// type LogoutServerSideProps = Promise<{
//   props: {
//     initialApolloState: Record<string, unknown>;
//     revalidate: number;
//     response: any;
//   };
// }>;

const Logout = (): JSX.Element | void => {
  const [{ data, error, fetching }, logoutFunc] = useLogoutMutation();
  useEffect(() => {
    logoutFunc();
  }, []);

  if (error) {
    return <ErrorMessage message={error.message} />;
  }
  if (fetching) {
    return <div>loading...</div>;
  }
  if (data) {
    setToken(null);
    logoutAllTabs();
    if (router) {
      router.push("/");
    }
  }
  return <div>LOUGOUT</div>;
};

Logout.layout = AppLayout;

export default Logout;
