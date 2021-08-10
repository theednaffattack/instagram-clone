import React from "react";
import { AppLayout } from "../components/layout.app";
import { LoginPage } from "../components/login-page";
import withApollo from "../lib/lib.apollo-client_v2";

function Login(): JSX.Element {
  return <LoginPage />;
}

const LoginApollo = withApollo(Login);

Login.layout = AppLayout;

LoginApollo.layout = AppLayout;

export default LoginApollo;
