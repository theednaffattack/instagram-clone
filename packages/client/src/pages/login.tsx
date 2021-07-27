import { AppProps } from "next/dist/next-server/lib/router/router";
import React from "react";
import { LoginPage } from "../components/login-page";

0;
function Login({ router }: AppProps): JSX.Element {
  return <LoginPage router={router} />;
}

export default Login;
