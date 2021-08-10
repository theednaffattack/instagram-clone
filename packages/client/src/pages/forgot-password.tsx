import { Box, Button, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Wrapper } from "../components/box-wrapper";
import { InputField } from "../components/forms.input-field";
import { LayoutAuthenticated } from "../components/layout-authenticated";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withApollo } from "../lib/lib.apollo-client_v2";

function ForgotPassword(): JSX.Element {
  const [mutationState, setMutationState] =
    useState<"isNOTComplete" | "isComplete">("isNOTComplete");
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={async (values) => {
        await forgotPassword({
          variables: {
            email: values.email,
          },
        });
        setMutationState("isComplete");
      }}
    >
      {({ handleSubmit, isSubmitting }) =>
        mutationState === "isComplete" ? (
          <Box>
            <Text>
              Please check your email address associated with this account. If
              an account with that email exists, we sent you an email.
            </Text>
          </Box>
        ) : (
          <Wrapper>
            <Form onSubmit={handleSubmit}>
              <InputField
                isRequired={true}
                label="email"
                name="email"
                placeholder="idi@idi.com"
              />

              <Button mt={4} type="submit" isLoading={isSubmitting}>
                reset password
              </Button>
            </Form>
          </Wrapper>
        )
      }
    </Formik>
  );
}

ForgotPassword.layout = LayoutAuthenticated;

const ForgotPasswordApollo = withApollo(ForgotPassword);

export default ForgotPasswordApollo;
