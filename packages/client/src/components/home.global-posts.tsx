import { Box, Button, Heading, Image, Stack, Text } from "@chakra-ui/core";
import React, { ReactElement, ReactNode } from "react";
import { ApolloError } from "@apollo/client";
import { GetGlobalPostsRelayQuery } from "../generated/graphql";

type GlobalPostsProps = {
  posts: GetGlobalPostsRelayQuery["getGlobalPostsRelay"];
  postsError: ApolloError | undefined;
  postsFetching: boolean;
};

type GlobalWithChildrenProps = {
  children?: ReactNode;
};

export function GlobalPostsStack({
  posts,
  postsError,
  postsFetching
}: GlobalPostsProps): ReactElement {
  // If loading and there aren't posts
  // loaded yet. Useful for a loading
  // more state.
  if (!posts && postsFetching) {
    return (
      <GlobalPostsFetching>
        <Text>loading...</Text>
      </GlobalPostsFetching>
    );
  }
  // if error
  if (postsError) {
    return (
      <GlobalPostsError>
        <Text>{postsError.message}</Text>
      </GlobalPostsError>
    );
  }
  // if somehow the array is empty
  if (posts && posts.edges.length === 0) {
    return <GlobalPostsEmpty />;
  }
  // if data...
  if (posts && posts.edges.length > 0) {
    const boxes = [];
    for (const post of posts.edges) {
      boxes.push(
        <Box key={post.node.id} p={5} shadow="md" borderWidth="1px" width={1 / 2}>
          <Heading fontSize="xl">{post.node.title}</Heading>
          <Image
            src={post.node.images ? post.node.images[0].uri : ""}
            placeholder="https://via.placeholder.com/150"
          />
          <Text mt={4}>{post.node.text}</Text>
        </Box>
      );
    }
    return (
      <Stack
        spacing={8}
        alignItems="center"
        width={[1 / 2, 1 / 2, 1 / 2, "900px"]}
        my="50px"
      >
        {boxes}

        <Button type="button" colorScheme="teal">
          load more
        </Button>
      </Stack>
    );
  } else {
    // this may not cut it as it may get null states
    return (
      <GlobalPostsUnexpectedState>
        <Text>Error: Unexpected state</Text>
      </GlobalPostsUnexpectedState>
    );
  }
}

function GlobalPostsEmpty() {
  return (
    <Stack spacing={8}>
      <Box p={5} shadow="md" borderWidth="1px">
        <Text>There are no global posts!</Text>
      </Box>
    </Stack>
  );
}

function GlobalPostsError({ children }: GlobalWithChildrenProps): ReactElement {
  return (
    <Stack spacing={8}>
      <Box p={5} shadow="md" borderWidth="1px">
        <Text>Error fetching global posts!</Text>
        {children}
      </Box>
    </Stack>
  );
}

function GlobalPostsFetching({
  children
}: GlobalWithChildrenProps): ReactElement {
  return (
    <Stack spacing={8}>
      <Box p={5} shadow="md" borderWidth="1px">
        {children}
      </Box>
    </Stack>
  );
}

function GlobalPostsUnexpectedState({
  children
}: GlobalWithChildrenProps): ReactElement {
  return (
    <Stack spacing={8}>
      <Box p={5} shadow="md" borderWidth="1px">
        {children}
      </Box>
    </Stack>
  );
}
