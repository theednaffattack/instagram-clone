import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import React, { useState } from "react";

import { Wrapper } from "../components/flex-wrapper";
import { InputField } from "../components/forms.input-field";
import { AppLayout } from "../components/layout.app";
import { useRegisterMutation } from "../generated/graphql";
import { logger } from "../lib/lib.logger";
import { toErrorMap } from "../lib/utilities.toErrorMap";

function Register(): JSX.Element {
  const [{ error }, register] = useRegisterMutation();
  const [registrationStatus, setRegistrationStatus] = useState<
    "isNotRegistered" | "hasRegistered"
  >("isNotRegistered");
  return (
    <Formik
      initialValues={{
        email: "",
        username: "",
        password: "",
        keepMeSignedIn: true,
        termsAndConditions: true,
      }}
      onSubmit={async (values, { setErrors }) => {
        try {
          const response = await register({
            data: {
              password: values.password,
              // firstName: "iti2",
              // lastName: "itiToo",
              email: values.email,
              username: values.username,
              // termsAndConditions: true, //values.termsAndConditions,
              // keepMeSignedIn: true, // values.keepMeSignedIn
            },
          });

          // if we have FieldError(s) we'll handle them here
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          }
          // SUCCESS
          if (response.data?.register.user) {
            setRegistrationStatus("hasRegistered");
            // router.push("/");
          }
        } catch (registerError) {
          // Server validation errors are caught and handled here.
          if (error?.graphQLErrors[0].extensions?.valErrors) {
            setErrors(toErrorMap(error?.graphQLErrors[0].extensions.valErrors));
          } else {
            logger.error("REGISTER ERROR");
            logger.error({ error: registerError });

            // Non validation errors that are also not FieldErrors,
            // but have been server transformed into the same format.
            // setErrors(toErrorMap(registerError));
          }
        }
      }}
    >
      {({ handleSubmit, isSubmitting }) => {
        return (
          <Wrapper flexDirection="column">
            {registrationStatus === "isNotRegistered" ? (
              <RegisterForm
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            ) : (
              <RegistrationSuccessMessage />
            )}
          </Wrapper>
        );
      }}
    </Formik>
  );
}

Register.layout = AppLayout;

export default Register;

function RegisterForm({
  handleSubmit,
  isSubmitting,
}: {
  handleSubmit: () => void;
  isSubmitting: boolean;
}) {
  return (
    <>
      <Form onSubmit={handleSubmit}>
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
            label="Email"
            name="email"
            placeholder="email"
            type="email"
            autoComplete="email"
          />
        </Box>
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

        <InputField
          isRequired={true}
          label="Terms & Conditions"
          name="termsAndConditions"
          placeholder="termsAndConditions"
          type="hidden"
          autoComplete="termsAndConditions"
        />
        <InputField
          isRequired={true}
          label="Keep Me Signed In"
          name="keepMeSignedIn"
          placeholder="keepMeSignedIn"
          type="hidden"
          autoComplete="keepMeSignedIn"
        />
        <Button colorScheme="teal" type="submit" isLoading={isSubmitting}>
          register
        </Button>
      </Form>
      <Text mx="auto" mt={3}>
        Already a member?{" "}
        <NextLink href="/login" passHref>
          <Link color="crimson">Sign in</Link>
        </NextLink>
      </Text>
    </>
  );
}

function RegistrationSuccessMessage() {
  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <Heading>Success!</Heading>
      <Text>Please check your email to confirm your account.</Text>
    </Flex>
  );
}
