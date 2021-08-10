import { Box, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

import { GlobalPostsStack } from "../components/home.global-posts";
import { LayoutAuthenticated } from "../components/layout-authenticated";
import { useGetGlobalPostsRelayQuery } from "../generated/graphql";
import withApollo from "../lib/lib.apollo-client_v2";

function Explore(): JSX.Element {
  const {
    data: dataGlobalPosts,
    error: errorPosts,
    loading: loadingPosts,
  } = useGetGlobalPostsRelayQuery();

  return (
    <Box>
      <Text>Hello world</Text>
      <NextLink href="/create-post" passHref>
        <Link>create post</Link>
      </NextLink>
      <GlobalPostsStack
        postsError={errorPosts}
        postsFetching={loadingPosts}
        posts={dataGlobalPosts?.getGlobalPostsRelay}
      />
    </Box>
  );
}

Explore.layout = LayoutAuthenticated;

const ExploreApollo = withApollo(Explore);

export default ExploreApollo;
