import React from "react";
import { NextPage } from "next";
import { Flex, Heading } from "@chakra-ui/core";

const TermsAndConditions: NextPage = () => {
  return (
    <Flex minHeight="100vh">
      <Flex width={[1]} minHeight="100vh">
        <Flex
          mt={[0, 5, 0]}
          flexDirection="column"
          width={[1]}
          justifyContent="center"
          alignItems="center"
        >
          <Flex
            flexDirection="column"
            mx={3}
            width={1}
            maxWidth={["350px", "350px"]}
            p={4}
            sx={{
              borderRadius: "10px",
              boxShadow: "0 2px 16px rgba(0, 0, 0, 0.25)"
            }}
            bg="rgb(242,242,242)"
          >
            <Flex mt={3} mb={4} justifyContent="center">
              <Heading color="text" fontSize={[5]} fontFamily="montserrat">
                Terms and Conditions
              </Heading>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TermsAndConditions;
