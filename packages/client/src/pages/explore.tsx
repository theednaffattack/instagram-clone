import { Box, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { GlobalPostsStack } from "../components/home.global-posts";
import { LayoutAuthenticated } from "../components/layout-authenticated";
import { useGetGlobalPostsRelayQuery } from "../generated/graphql";

function Explore(): JSX.Element {
  const [
    { data: dataGlobalPosts, error: errorPosts, fetching: fetchingPosts },
  ] = useGetGlobalPostsRelayQuery();

  return (
    <Box>
      <Text>Hello world</Text>
      <NextLink href="/create-post" passHref>
        <Link>create post</Link>
      </NextLink>
      <GlobalPostsStack
        postsError={errorPosts}
        postsFetching={fetchingPosts}
        posts={dataGlobalPosts?.getGlobalPostsRelay}
      />
    </Box>
  );
}

Explore.layout = LayoutAuthenticated;

export { Explore as default };
