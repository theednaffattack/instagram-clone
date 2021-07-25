// import { useConfirmUserMutation } from "../../generated/graphql";
import { Button, Flex, Link, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import NextLink from "next/link";
import React, { ReactElement } from "react";
import { Wrapper } from "../../components/box-wrapper";
import {
  ConfirmUserDocument,
  ConfirmUserMutation,
  ConfirmUserMutationVariables,
} from "../../generated/graphql";
import { addApolloState, initializeApollo } from "../../lib/lib.apollo-client";
import { MyContext } from "../../lib/types";

type ConfirmationProps = {
  userConfirmed: boolean;
};

const Confirmation: NextPage<ConfirmationProps> = ({ userConfirmed }) => {
  let body: ReactElement;
  if (userConfirmed) {
    body = (
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Text>Thank you for confirming your account!</Text>
        <NextLink href="/" passHref>
          <Link>Login</Link>
        </NextLink>
      </Flex>
    );
  } else {
    body = (
      <Flex
        h="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Text mt={4}>
          The confirmation link has expired. Your account has not been
          confirmed.
        </Text>
        <Button type="button" mt={4} colorScheme="teal">
          Request a new confirmation
        </Button>
      </Flex>
    );
  }

  return <Wrapper>{body}</Wrapper>;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getServerSideProps(ctx: MyContext): Promise<any> {
  const apolloClient = initializeApollo();

  // await apolloClient.query({
  //   query: ALL_POSTS_QUERY,
  //   variables: allPostsQueryVars,
  // });

  let response;
  // Take token as a URL param and confirm the user.
  try {
    response = await apolloClient.mutate<
      ConfirmUserMutation,
      ConfirmUserMutationVariables
    >({
      mutation: ConfirmUserDocument,
      variables: {
        token: typeof ctx.query.token === "string" ? ctx.query.token : "",
      },
    });
  } catch (error) {
    console.warn("CONFIRMATION GET INITIAL PROPS", error);
  }

  return addApolloState(apolloClient, {
    props: { userConfirmed: response },
  });
}

// Confirmation.getInitialProps = async (ctx: MyContext) => {
//   if (!apolloClient) apolloClient = initializeApollo();

//   let response;
//   // Take token as a URL param and confirm the user.
//   try {
//     response = await apolloClient.mutate({
//       mutation: ConfirmUserDocument,
//       variables: {
//         token: typeof query.token === "string" ? query.token : "",
//       },
//     });
//   } catch (error) {
//     console.warn("CONFIRMATION GET INITIAL PROPS", error);
//   }
//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//     },
//     revalidate: 1,

//     userConfirmed: response?.data?.confirmUser,
//   };
// };

export default Confirmation;
