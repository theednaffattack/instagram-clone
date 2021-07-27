import { Box, Button, Link, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import type Router from "next/dist/next-server/lib/router/router";
import NextLink from "next/link";
import React from "react";
import { Wrapper } from "../components/flex-wrapper";
import { InputField } from "../components/forms.input-field";
import { useLoginMutation } from "../generated/graphql";
import { setAccessToken } from "../lib/lib.access-token";
import { logger } from "../lib/lib.logger";
import { LoginErrorMessage } from "./login-error-message";

interface LoginPageProps {
  router: Router;
}

export function LoginPage({ router }: LoginPageProps): JSX.Element {
  const { message } = router.query;

  const [login] = useLoginMutation();

  return (
    <Formik
      initialValues={{ username: "", password: "", user_confirmed: <></> }}
      onSubmit={async (values) => {
        let response;
        try {
          response = await login({
            variables: { username: values.username, password: values.password },
          });
        } catch (error) {
          logger.error(error, "SIGN IN ERROR");
          throw new Error("Sign in error.");
        }
        if (
          response &&
          response.data &&
          response.data.login &&
          response.data.login.tokenData &&
          response.data.login.tokenData.userId
        ) {
          setAccessToken(response.data.login.tokenData.accessToken);
          router.push("/feed");
        }
      }}
    >
      {({ handleSubmit, isSubmitting }) => {
        return (
          <Wrapper flexDirection="column">
            <>
              <Form onSubmit={handleSubmit}>
                <InputField
                  isRequired={true}
                  type="hidden"
                  name="user_confirmed"
                />
                <InputField
                  isRequired={true}
                  label="Username"
                  name="username"
                  placeholder="Idi Ogunye"
                  autoComplete="username"
                />

                {message ? (
                  <LoginErrorMessage>{message}</LoginErrorMessage>
                ) : null}

                <Box my={4}>
                  <InputField
                    isRequired={true}
                    label="Password"
                    name="password"
                    placeholder="password"
                    type="password"
                    autoComplete="current-password"
                  />
                </Box>
                <Button
                  colorScheme="teal"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  login
                </Button>
              </Form>
              <Text mx="auto" mt={3}>
                Need an account?{" "}
                <NextLink href="/register" passHref>
                  <Link color="crimson">Register</Link>
                </NextLink>
              </Text>
            </>
          </Wrapper>
        );
      }}
    </Formik>
  );
}
