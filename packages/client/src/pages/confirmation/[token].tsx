// import { useConfirmUserMutation } from "../../generated/graphql";
import { Button, Flex, Link, Text } from "@chakra-ui/core";
import { NextPage } from "next";
import NextLink from "next/link";
import React, { ReactElement } from "react";
import { Wrapper } from "../../components/box-wrapper";
import {
  ConfirmUserDocument
} from "../../generated/graphql";
import { initializeApollo } from "../../lib/config.apollo-client";
import { MyContext } from "../../lib/types";

type ConfirmationProps = {
  userConfirmed: boolean;
};

const Confirmation: NextPage<ConfirmationProps> = ({
  userConfirmed
}) => {
  
  

  let body: ReactElement;
  if (userConfirmed) {
    body = (
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Text>Thank you for confirming your account!</Text>
        <NextLink href="/login" passHref>
          <Link>
          Login
          </Link>
        </NextLink>
      </Flex>
    );
  } else {
    body = (
      <Flex h="100%" flexDirection="column" alignItems="center" justifyContent="center">
        <Text mt={4}>The confirmation link has expired. Your account has not been confirmed.</Text>
        <Button type="button" mt={4} colorScheme="teal">
          Request a new confirmation
        </Button>
      </Flex>
    );
  }

  return (
    <Wrapper>
      
        {body}
    </Wrapper>
  );
};

Confirmation.getInitialProps = async (ctx: MyContext) => {
  if (!ctx.apolloClient) ctx.apolloClient = initializeApollo();

  let response;
  // Take token as a URL param and confirm the user.
  try {
    response = await ctx.apolloClient.mutate({
      mutation: ConfirmUserDocument,
      variables: {
        token: typeof ctx.query.token === "string" ? ctx.query.token : ""
      }
    });
    
  } catch (error) {
    console.warn("CONFIRMATION GET INITIAL PROPS", error);
  }
  return {
    props: {
      initialApolloState: ctx.apolloClient.cache.extract()
    },
    revalidate: 1,

    
    userConfirmed: response?.data?.confirmUser
  };
};

export default Confirmation;
