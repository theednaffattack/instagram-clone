import { Box, Link, Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React from "react";
import { GlobalPostsStack } from "../components/home.global-posts";
import { useGetGlobalPostsRelayQuery } from "../generated/graphql";
import { createUrqlClient } from "../lib/utilities.create-urql-client";

function Index() {
  const { data: dataGlobalPosts, error: postsError, loading: postsLoading } = useGetGlobalPostsRelayQuery();

  return (
    <Box>
      <Text>Hello world</Text>
      <NextLink href="/create-post" passHref>
        <Link>create post</Link>
      </NextLink>
      <GlobalPostsStack
      postsError={postsError}
      postsFetching={postsLoading}
       posts={dataGlobalPosts?.getGlobalPostsRelay} />
    </Box>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: false })(Index);
