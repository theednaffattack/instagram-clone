// import router from "next/router";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { ErrorMessage } from "../components/error-message";
import { AppLayout } from "../components/layout.app";
import { useLogoutMutation } from "../generated/graphql";
import { setToken } from "../lib/lib.in-memory-access-token";
import { logoutAllTabs } from "../lib/logoutAllTabs";

const Logout = (): JSX.Element | void => {
  const router = useRouter();
  const [{ data, error }, logoutFunc] = useLogoutMutation();
  useEffect(() => {
    logoutFunc();
  }, [logoutFunc]);

  if (error) {
    return <ErrorMessage message={error.message} />;
  }
  if (data) {
    setToken(null);
    logoutAllTabs();
    if (router) {
      router.push("/");
    }
  }
  return <></>;
};

Logout.layout = AppLayout;

export default Logout;
