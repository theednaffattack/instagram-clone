import router from "next/router";
import React, { useEffect } from "react";
import { ErrorMessage } from "../components/error-message";
import { AppLayout } from "../components/layout.app";
import { useLogoutMutation } from "../generated/graphql";
import withApollo from "../lib/lib.apollo-client_v2";

// type LogoutServerSideProps = Promise<{
//   props: {
//     initialApolloState: Record<string, unknown>;
//     revalidate: number;
//     response: any;
//   };
// }>;

const Logout = (): JSX.Element | void => {
  const [logoutFunc, { data, error, loading }] = useLogoutMutation();
  useEffect(() => {
    logoutFunc();
  }, []);

  if (error) {
    return <ErrorMessage message={error.message} />;
  }
  if (loading) {
    return <div>loading...</div>;
  }
  if (data) {
    if (router) {
      router.push("/");
    }
  }
  return <div>LOUGOUT</div>;
};

Logout.layout = AppLayout;

const LogoutApollo = withApollo(Logout);

export default LogoutApollo;
