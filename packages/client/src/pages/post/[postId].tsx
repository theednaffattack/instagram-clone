import { NextPage } from "next";
import { Router } from "next/router";
import React from "react";
import { Box, Flex, Heading, Image, Text } from "@chakra-ui/core";

import {
  MeDocument,
  MeQuery,
  useGetGlobalPostByIdQuery
} from "../../generated/graphql";
import { initializeApollo } from "../../lib/config.apollo-client";
import { MyContext } from "../../lib/types";

type PostByIdProps = {
  router?: Router;
  me: MeQuery;
};

const PostById: NextPage<PostByIdProps> = ({ router }) => {
  const { data } = useGetGlobalPostByIdQuery({
    variables: {
      getpostinput: {
        postId: router?.query.postId as string
      }
    }
  });
  return (
    <Flex flexDirection="column">
      <Heading as="h1" size="4xl" isTruncated>
        {" "}
        {data?.getGlobalPostById?.title}
      </Heading>
      <Text> {data?.getGlobalPostById?.text}</Text>
      <Box w={{ sm: "100%", md: "100%", lg: "33%", xl: "33%" }}>
        <Image src={data?.getGlobalPostById?.images?.[0].uri} />
      </Box>
    </Flex>
  );
};

PostById.getInitialProps = async (ctx: MyContext) => {
  if (!ctx.apolloClient) ctx.apolloClient = initializeApollo();

  let meResponse;
  try {
    meResponse = await ctx.apolloClient.mutate({
      mutation: MeDocument
    });
  } catch (error) {
    console.warn("ME ERROR - POST ROUTE", error);
  }

  return {
    me: meResponse?.data ? meResponse?.data : {}
  };
};

export default PostById;
