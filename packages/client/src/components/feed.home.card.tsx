import { Box, Flex, Image, Text, Avatar, IconButton } from "@chakra-ui/react";
import React from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import {
  Image as ImageType,
  Like,
  GlobalPostResponse,
  Maybe,
  User,
} from "../generated/graphql";

import { LikesAndCommentsSummary } from "./home.global-feed.likes";

// TODO: Ditch this whole component and just use one.

type PostNode = {
  __typename?: "GlobalPostResponse";
} & Pick<
  GlobalPostResponse,
  | "id"
  | "title"
  | "text"
  | "likes_count"
  | "comments_count"
  | "currently_liked"
  | "created_at"
> & {
    user?: Maybe<
      { __typename?: "User" } & Pick<
        User,
        "id" | "username" | "profileImageUri"
      >
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

interface CardProps {
  cardProps: PostNode;
  // setErrorFlashes: React.Dispatch<React.SetStateAction<"hidden" | "visible">>;
}

export function PostCard({ cardProps }: CardProps): JSX.Element {
  const {
    created_at,
    comments_count,
    currently_liked,
    id,
    images,
    likes_count,
    text,
    user,
  } = cardProps;
  return (
    <Box key={id}>
      <Flex alignItems="center" p={3}>
        <Avatar src={user?.profileImageUri ?? ""} name={user?.username} />{" "}
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
        setErrorFlashes={() => alert("Error Flashes - FAKE!!!")}
      />
    </Box>
  );
}
