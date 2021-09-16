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
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Wrapper } from "../components/flex-wrapper";
import { InputField } from "../components/forms.input-field";
import { useLoginMutation } from "../generated/graphql";
import { handleAsyncSimple } from "../lib/lib.handle-async-client";
import { setToken } from "../lib/lib.in-memory-access-token";
import { logger } from "../lib/lib.logger";
import { LoginErrorMessage } from "./login-error-message";

export function LoginPage(): JSX.Element {
  const router = useRouter();
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  const [, loginFunc] = useLoginMutation();
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
      onSubmit={async (values, { setErrors }) => {
        const [response, loginError] = await handleAsyncSimple(async () => {
          return await loginFunc({
            username: values.username,
            password: values.password,
          });
        });

        if (loginError) {
          logger.error("UH OH LOGIN ERROR");
          logger.error({ error: loginError });
        }

        if (response?.data?.login?.errors) {
          setErrors({
            [response.data.login.errors[0].field]:
              response.data.login.errors[0].message,
          });
        }
        if (response?.data?.login?.tokenData?.userId) {
          // setAccessToken(response.data.login.tokenData.accessToken);
          logger.info("SETTING TOKEN DATA - 1");
          logger.info(response.data.login.tokenData);
          if (response.data.login.tokenData.accessToken) {
            logger.info("SETTING TOKEN DATA -  2");

            setToken(response.data.login.tokenData);
          }
          // Can't se the refresh token since the API doesn't repsond
          // with it.
          // localStorage.setItem(
          //   "refreshToken",
          //   response.data.refreshLogin.refreshToken
          // );
          if (router.query.next && router.query.next !== "/") {
            // If there is a next query variable then use it as the URL.
            router.push(router.query.next as string);
          } else {
            // default
            router.push("/feed");
          }
        }

        // let response;
        // try {
        //   response = await loginFunc({
        //     username: values.username,
        //     password: values.password,
        //   });

        //   logger.info("What is the RESPONSE?");
        //   logger.info(response);

        //   if (response?.data?.login?.errors) {
        //     setErrors({
        //       [response.data.login.errors[0].field]:
        //         response.data.login.errors[0].message,
        //     });
        //   }
        //   if (response?.data?.login?.tokenData?.userId) {
        //     // setAccessToken(response.data.login.tokenData.accessToken);
        //     logger.info("SETTING TOKEN DATA - 1");
        //     logger.info(response.data.login.tokenData);
        //     if (response.data.login.tokenData.accessToken) {
        //       logger.info("SETTING TOKEN DATA -  2");

        //       setToken(response.data.login.tokenData);
        //     }
        //     // Can't se the refresh token since the API doesn't repsond
        //     // with it.
        //     // localStorage.setItem(
        //     //   "refreshToken",
        //     //   response.data.refreshLogin.refreshToken
        //     // );
        //     if (router.query.next && router.query.next !== "/") {
        //       // If there is a next query variable then use it as the URL.
        //       router.push(router.query.next as string);
        //     } else {
        //       // default
        //       router.push("/feed");
        //     }
        //   }
        // } catch (error) {
        //   logger.error("SIGN IN ERROR");
        //   logger.error({ error });
        //   throw new Error("Sign in error.");
        // }

        if (response && response.error && response.error.message) {
          setFlashMessage(response.error.message);
        }
      }}
    >
      {({ handleSubmit, isSubmitting }) => {
        return (
          <Wrapper flexDirection="column">
            <>
              {/* {JSON.stringify(getToken(), null, 2)} */}
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
}: PropsWithChildren<{ errorTitle: string }>): JSX.Element | null {
  const [flashVisibility, setFlashVisibility] = useState<
    "isHidden" | "isVisible"
  >("isVisible");

  const closeButtonFocusRef = useRef<HTMLButtonElement>();

  useEffect(() => {
    closeButtonFocusRef.current?.focus();
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
      <button ref={closeButtonFocusRef as any}>close</button>
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
        ref={closeButtonFocusRef as any}
      />
    </Alert>
  );
}
