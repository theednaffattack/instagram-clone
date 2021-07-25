import { Box, Button, Link, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { signIn } from "next-auth/client";
import type Router from "next/dist/next-server/lib/router/router";
import NextLink from "next/link";
import React from "react";
import { Wrapper } from "../components/flex-wrapper";
import { InputField } from "../components/forms.input-field";
import { LoginErrorMessage } from "./login-error-message";

interface LoginPageProps {
  router: Router;
}

export function Login({ router }: LoginPageProps): JSX.Element {
  const { field, message } = router.query;

  // eslint-disable-next-line no-console
  console.log("VIEW FIELD AND MESSAGE");
  // eslint-disable-next-line no-console
  console.log({ [`${field}`]: message });

  return (
    <Formik
      initialValues={{ username: "", password: "", user_confirmed: <></> }}
      onSubmit={async (values) => {
        try {
          await signIn("login", {
            // redirect: false,
            username: values.username,
            password: values.password,
            callbackUrl: `${
              process.env.NODE_ENV !== "production"
                ? process.env.NEXTAUTH_URL
                : process.env.NEXT_PUBLIC_PRODUCTION_BASE_URL
            }/feed`,
          });
        } catch (error) {
          console.error("SIGN IN ERROR");
          console.error(error);
          throw new Error("Sign in error.");
        }
      }}
    >
      {({ handleSubmit, isSubmitting }) => {
        if (typeof message === "string" && typeof field === "string") {
          // eslint-disable-next-line no-console
          console.log("HEEEEEEY");
          // setErrors({ [`${field}`]: message });
          // setErrors({ username: "who" });
        }
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
