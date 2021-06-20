import { Alert, AlertIcon, AlertTitle, Box, Button, CloseButton, Flex, Link, Text } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import NextLink from "next/link";
import { Router } from "next/router";
import React, { useEffect, useState } from "react";
import { Wrapper } from "../components/flex-wrapper";
import { InputField } from "../components/forms.input-field";
import {
  useLoginMutation
} from "../generated/graphql";
import { toErrorMap } from "../lib/utilities.toErrorMap";


type LoginProps ={
  router: Router;
}

const Login: NextPage<LoginProps> = ({router}) => {
  const [flashMessage, setFlashMessage] = useState<"hidden" | "visible">("hidden")
  const {flash} = router.query;
  const [userConfirmedHelper, setUserConfirmedHelper] = useState(<></>);
  const [login] = useLoginMutation();
  useEffect(() => {
    setFlashMessage(flash ? "visible" : "hidden")
  }, [])
  return (
    <Formik
      initialValues={{ username: "", password: "", user_confirmed: <></> }}
      onSubmit={async (values, { setErrors }) => {
        try {
          const response = await login({
            variables: {
              password: values.password,
              username: values.username
            }
          });
          // Look for FieldError(s) on response
          // data.
          if (response.data?.login?.errors) {
            const errorMap = toErrorMap(
              response.data.login.errors
              // loginFnError?.graphQLErrors[0].extensions!.valErrors
            );
            // Trap any user confirmation errors
            // and set a helper in the UI.
            if ("user_confirmed" in errorMap) {
              setUserConfirmedHelper(
                <Box>
                  <Text color="crimson">{errorMap.user_confirmed}</Text>
                  <Box>
                    <NextLink href="/re-confirmation" passHref>
                      <Link>send another confirmation email</Link>
                    </NextLink>
                  </Box>
                </Box>
              );

              // Delete the user_confirmed error
              // and set any other FieldError(s)
              delete errorMap.user_confirmed;
              setErrors(errorMap);
            } else {
              setErrors(errorMap);
            }
          }

          // SUCCESS
          if (response.data?.login?.user) {
            // if we've set a redirect after login,
            // follow it. Otherwise go to home page.
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        } catch (loginFnError) {
          // This will catch Network and unkown errors?
          console.error("LOGIN ERROR\n", loginFnError);
        }
      }}
    >
      {({ handleSubmit, isSubmitting }) => {
        return (
          <Wrapper flexDirection="column">
            <>
            {flash && flashMessage === "visible" ? <Alert
  flexDirection="column"
  justifyContent="center"
  textAlign="center" status="error">
    <Flex>

  <AlertIcon />
  <AlertTitle mr={2}>{flash}</AlertTitle>
    </Flex>
            {/* <AlertDescription>{flash}</AlertDescription> */}
  <CloseButton position="absolute" right="8px" top="8px" disabled={!flash} onClick={()=>setFlashMessage("hidden")} />
</Alert> : ""}
              <Form onSubmit={handleSubmit}>
                {userConfirmedHelper}
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
};

export default Login;
