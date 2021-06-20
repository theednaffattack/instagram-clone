import { Box, Button, Text } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { InputField } from "../components/forms.input-field";
import { Wrapper } from "../components/box-wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../lib/utilities.create-urql-client";

function ForgotPassword() {
  const [mutationState, setMutationState] = useState<
    "isNOTComplete" | "isComplete"
  >("isNOTComplete");
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={async (values) => {
        await forgotPassword({
          variables: {
            email: values.email
          }
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

export default withUrqlClient(createUrqlClient)(ForgotPassword);
