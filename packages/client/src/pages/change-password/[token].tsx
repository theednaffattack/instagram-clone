import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { GetServerSidePropsContext } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import { Wrapper } from "../../components/box-wrapper";
import { InputField } from "../../components/forms.input-field";
import { LayoutAuthenticated } from "../../components/layout-authenticated";
import { FieldError, useChangePasswordMutation } from "../../generated/graphql";
import withApollo from "../../lib/lib.apollo-client_v2";
import { MyNextPage } from "../../lib/types";
import { formatValidationErrors } from "../../lib/utilities.graphQLErrors.format-apollo-validation-errors";
import { toErrorMap } from "../../lib/utilities.toErrorMap";

function ChangePassword({ token }: MyNextPage<{ token: string }>): JSX.Element {
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
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            },
          },
        });
        let validationErrors: FieldError[];
        if (response.errors) {
          validationErrors = formatValidationErrors(response.errors);
          const errorMap = toErrorMap(validationErrors);
          setErrors(errorMap);
        }

        const changePassErrors = response.data?.changePassword?.errors;
        const successfulUser = response.data?.changePassword?.user;

        if (changePassErrors) {
          const errorMap = toErrorMap([changePassErrors]);

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
}

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext): Promise<{
  token: string;
}> {
  return {
    token: query.token as string,
  };
}

ChangePassword.layout = LayoutAuthenticated;

const ChangePasswordApollo = withApollo(ChangePassword);

export default ChangePasswordApollo;
