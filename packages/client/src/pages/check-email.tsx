import { Button, Flex, Text } from "@chakra-ui/core";
import {  EmailIcon } from "@chakra-ui/icons";
import { NextPage } from "next";
import React from "react";

function handleDismiss() {
  console.log("dismiss button clicked");
}

type CheckEmailProps = {}

const CheckEmail: NextPage<CheckEmailProps> = () => {
  return (
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <Flex width="100px">
          <span role="img" aria-label="Close">
            <EmailIcon boxSize={8} color="crimson"  />
            
          </span>
        </Flex>
        <Text mb={3} fontSize={[24]} fontWeight={600} fontFamily="montserrat">
          We sent you an email!
        </Text>
        <Text fontFamily="montserrat">
          Please check your email to confirm your account.
        </Text>
        <Button colorScheme="teal" mt={5} onClick={handleDismiss}>
          Got it!
        </Button>
      </Flex>
  );
};

export default CheckEmail;