import { Box, Button, Flex, Link, Text } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import { Wrapper } from "../../components/box-wrapper";
import { InputField } from "../../components/forms.input-field";
import {
  ChangePasswordMutation,
  FieldError,
  useChangePasswordMutation
} from "../../generated/graphql";
import { formatValidationErrors } from "../../lib/utilities.graphQLErrors.format-apollo-validation-errors";
import { toErrorMap } from "../../lib/utilities.toErrorMap";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [changePassword] = useChangePasswordMutation();
  const [tokenErrorHelper, setTokenErrorHelper] = useState<ReactElement>();
  const router = useRouter();
  return (
    <Formik
      initialValues={{ password: "", token }}
      onSubmit={async (values, { setErrors }) => {
        const response = await changePassword({
          variables: {
            data: {
              password: values.password,
              token:
                typeof router.query.token === "string" ? router.query.token : ""
            }
          }
        });
        let validationErrors: FieldError[];
        if (response.errors) {
          validationErrors = formatValidationErrors<ChangePasswordMutation>(
            response.errors
          );
          const errorMap = toErrorMap(validationErrors);
          setErrors(errorMap);
        }

        const changePassErrors = response.data?.changePassword?.errors;
        const successfulUser = response.data?.changePassword?.user;

        if (changePassErrors) {
          const errorMap = toErrorMap(changePassErrors);

          if ("token" in errorMap) {
            setTokenErrorHelper(
              <Flex>
                <Text color="crimson" mr={2}>
                  Reset password failed.
                </Text>
                <NextLink href="/forgot-password" passHref>
                  <Link>Click here to reset password</Link>
                </NextLink>
              </Flex>
            );
            delete errorMap.token;
          }
          setErrors(errorMap);
        } else if (successfulUser) {
          router.push("/");
        }
      }}
    >
      {({ handleSubmit, isSubmitting }) => {
        return (
          <Wrapper>
            <Form onSubmit={handleSubmit}>
              <InputField
                isRequired={true}
                label="New password"
                name="password"
                type="password"
                autoComplete="new-password"
              />
              <InputField isRequired={true} name="token" type="hidden" />
              <Box>{tokenErrorHelper}</Box>
              <Button mt={4} type="submit" isLoading={isSubmitting}>
                change password
              </Button>
            </Form>
          </Wrapper>
        );
      }}
    </Formik>
  );
};

// ChangePassword.getInitialProps = ({ query }) => {
//   return {
//     token: query.token as string
//   };
// };

export default ChangePassword;
