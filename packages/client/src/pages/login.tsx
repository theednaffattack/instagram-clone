import React from "react";
import { AppLayout } from "../components/layout.app";
import { LoginPage } from "../components/login-page";

function Login(): JSX.Element {
  return <LoginPage />;
}

Login.layout = AppLayout;

export default Login;
