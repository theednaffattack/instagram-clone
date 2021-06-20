import { Box, Link, Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React from "react";
import { GlobalPostsStack } from "../components/home.global-posts";
import { useGetGlobalPostsRelayQuery } from "../generated/graphql";
import { createUrqlClient } from "../lib/utilities.create-urql-client";

function Index() {
  const { data: dataGlobalPosts, error: errorPosts, loading: loadingPosts } = useGetGlobalPostsRelayQuery();

  return (
    <Box>
      <Text>Hello world</Text>
      <NextLink href="/create-post" passHref>
        <Link>create post</Link>
      </NextLink>
      <GlobalPostsStack
      postsError={errorPosts}
      postsFetching={loadingPosts}
       posts={dataGlobalPosts?.getGlobalPostsRelay} />
    </Box>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: false })(Index);
