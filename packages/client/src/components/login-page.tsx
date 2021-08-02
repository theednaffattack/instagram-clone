import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Flex,
  Link,
  Text,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import type Router from "next/dist/next-server/lib/router/router";
import NextLink from "next/link";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
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
  const [flashMessage, setFlashMessage] = useState<string>(null);
  const [login] = useLoginMutation();

  const { message } = router.query;

  useEffect(() => {
    // set flash message
    if (router.query.error) {
      setFlashMessage(router.query.error as string);
    }
  }, [router.query]);

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
        if (response && response.errors && response.errors.length) {
          setFlashMessage(response.errors[0].message);
        }
        if (
          response &&
          response.data &&
          response.data.login &&
          response.data.login.tokenData &&
          response.data.login.tokenData.userId
        ) {
          setAccessToken(response.data.login.tokenData.accessToken);
          if (router.query.next && router.query.next !== "/") {
            // If there is a next query variable then use it as the URL.
            router.push(router.query.next as string);
          } else {
            // default
            router.push("/feed");
          }
        }
      }}
    >
      {({ handleSubmit, isSubmitting }) => {
        return (
          <Wrapper flexDirection="column">
            <>
              {flashMessage ? (
                <LoginFlash
                  errorTitle={
                    flashMessage && flashMessage.includes("authenticated")
                      ? "Authenticatin error"
                      : "Unknown Error"
                  }
                >
                  <p>{flashMessage}</p>
                </LoginFlash>
              ) : null}

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

function LoginFlash({
  children,
  errorTitle,
}: PropsWithChildren<{ errorTitle: string }>): JSX.Element {
  const [flashVisibility, setFlashVisibility] =
    useState<"isHidden" | "isVisible">("isVisible");
  const closeButtonFocusRef = useRef<HTMLButtonElement>();

  useEffect(() => {
    closeButtonFocusRef.current.focus();
  }, []);

  if (flashVisibility === "isHidden") {
    return null;
  }

  return (
    <Alert
      flexDirection="column"
      justifyContent="center"
      textAlign="center"
      status="error"
      // maxWidth="300px"
    >
      <Flex>
        <AlertIcon />
        <AlertTitle mr={2}>{errorTitle}</AlertTitle>
      </Flex>
      <AlertDescription>{children}</AlertDescription>
      <CloseButton
        position="absolute"
        right="8px"
        top="8px"
        disabled={!children}
        onClick={(event) => {
          event.preventDefault();
          setFlashVisibility("isHidden");
        }}
        tabIndex={0}
        type="button"
        ref={closeButtonFocusRef}
      />
    </Alert>
  );
}
