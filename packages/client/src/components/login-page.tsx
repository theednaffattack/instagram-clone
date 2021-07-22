import {
  Alert,
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
import { signIn } from "next-auth/client";
import type Router from "next/dist/next-server/lib/router/router";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { Wrapper } from "../components/flex-wrapper";
import { InputField } from "../components/forms.input-field";

interface LoginPageProps {
  router: Router;
}

export function Login({ router }: LoginPageProps): JSX.Element {
  const [flashMessage, setFlashMessage] =
    useState<"hidden" | "visible">("hidden");
  const { flash } = router.query;
  // const [userConfirmedHelper, setUserConfirmedHelper] = useState(<></>);
  // const [login] = useLoginMutation();
  useEffect(() => {
    setFlashMessage(flash ? "visible" : "hidden");
  }, []);
  return (
    <Formik
      initialValues={{ username: "", password: "", user_confirmed: <></> }}
      onSubmit={async (values, { setErrors: _setErrors }) => {
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

        // try {
        //   const response = await login({
        //     variables: {
        //       password: values.password,
        //       username: values.username,
        //     },
        //   });
        //   // Look for FieldError(s) on response
        //   // data.
        //   if (response.data?.login?.errors) {
        //     const errorMap = toErrorMap(
        //       response.data.login.errors
        //       // loginFnError?.graphQLErrors[0].extensions!.valErrors
        //     );
        //     // Trap any user confirmation errors
        //     // and set a helper in the UI.
        //     if ("user_confirmed" in errorMap) {
        //       setUserConfirmedHelper(
        //         <Box>
        //           <Text color="crimson">{errorMap.user_confirmed}</Text>
        //           <Box>
        //             <NextLink href="/re-confirmation" passHref>
        //               <Link>send another confirmation email</Link>
        //             </NextLink>
        //           </Box>
        //         </Box>
        //       );

        //       // Delete the user_confirmed error
        //       // and set any other FieldError(s)
        //       delete errorMap.user_confirmed;
        //       setErrors(errorMap);
        //     } else {
        //       setErrors(errorMap);
        //     }
        //   }

        //   // SUCCESS
        //   if (response.data?.login?.user) {
        //     // console.log("SUCCESS!!!");w

        //     // if we've set a redirect after login,
        //     // follow it. Otherwise go to home page.
        //     if (typeof router.query.next === "string") {
        //       router.push(router.query.next);
        //     } else {
        //       router.push("/");
        //     }
        //   }
        // } catch (loginFnError) {
        //   // This will catch Network and unkown errors?
        //   console.error("LOGIN ERROR\n", loginFnError);
        // }
      }}
    >
      {({ handleSubmit, isSubmitting }) => {
        return (
          <Wrapper flexDirection="column">
            <>
              {flash && flashMessage === "visible" ? (
                <Alert
                  flexDirection="column"
                  justifyContent="center"
                  textAlign="center"
                  status="error"
                >
                  <Flex bg="pink">
                    <AlertIcon />
                    <AlertTitle mr={2}>{flash}</AlertTitle>
                  </Flex>
                  {/* <AlertDescription>{flash}</AlertDescription> */}
                  <CloseButton
                    position="absolute"
                    right="8px"
                    top="8px"
                    disabled={false}
                    onClick={() => setFlashMessage("hidden")}
                  />
                </Alert>
              ) : (
                ""
              )}
              {`${
                process.env.NODE_ENV !== "production"
                  ? process.env.NEXTAUTH_URL
                  : process.env.NEXT_PUBLIC_PRODUCTION_BASE_URL
              }/feed`}
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
