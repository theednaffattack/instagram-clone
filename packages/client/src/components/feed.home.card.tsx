import { Box, Flex, Image, Text, Avatar, IconButton } from "@chakra-ui/core";
import React from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import {
  Image as ImageType,
  Like,
  GlobalPostReturnType,
  Maybe,
  User
} from "../generated/graphql";

import { LikesAndCommentsSummary } from "./home.global-feed.likes";

type PostNode = {
  __typename?: "GlobalPostReturnType";
} & Pick<
  GlobalPostReturnType,
  | "id"
  | "title"
  | "text"
  | "likes_count"
  | "comments_count"
  | "currently_liked"
  | "created_at"
> & {
    user?: Maybe<
      { __typename?: "User" } & Pick<User, "id" | "username" | "profileImgUrl">
    >;
    images?: Maybe<
      Array<
        {
          __typename?: "Image";
        } & Pick<ImageType, "id" | "uri">
      >
    >;
    likes?: Maybe<
      Array<
        {
          __typename?: "Like";
        } & Pick<Like, "id">
      >
    >;
  };

type CardProps = {
  cardProps: PostNode;
};

export function PostCard({ cardProps }: CardProps) {
  const {
    created_at,
    comments_count,
    currently_liked,
    id,
    images,
    likes_count,
    text,
    user
  } = cardProps;
  return (
    <Box key={id}>
      <Flex alignItems="center" p={3}>
        <Avatar src={user?.profileImgUrl ?? ""} name={user?.username} />{" "}
        <Text ml={4}>{user?.username}</Text>
        <IconButton
          ml="auto"
          aria-label="Search database"
          icon={<BiDotsHorizontalRounded />}
        />
      </Flex>
      <Box>
        <Image src={images && images[0] ? images[0].uri : ""} />
        <Flex>
          <Text ml="auto">{created_at}</Text>
        </Flex>
        <Text>{text}</Text>
      </Box>

      <LikesAndCommentsSummary
        comments_count={comments_count}
        currently_liked={currently_liked}
        likes_count={likes_count}
        postId={id ? id : ""}
      />
    </Box>
  );
}
