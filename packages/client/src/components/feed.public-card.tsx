import { Box, Flex, Skeleton, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  GlobalPostResponse,
  Image as ImageType,
  Like,
  Maybe,
  User,
} from "../generated/graphql";
import { FeedBoxedImage } from "./feed.boxed-image";
import { FeedTopBar } from "./feed.card-top-bar";
import { CollectionsButton } from "./feed.collections-button";
import { LikesAndCommentsSummary } from "./home.global-feed.likes";

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
  | "date_formatted"
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

type CardProps = {
  cardProps: PostNode;
  loadingPosts: boolean;
};

export function PublicPostCard({ cardProps }: CardProps): JSX.Element {
  const {
    comments_count,
    currently_liked,
    date_formatted,
    id,
    images,
    likes_count,
    text,
  } = cardProps;

  const [imageLoadState, setImageLoadState] =
    useState<"isLoaded" | "isLoading" | "isError" | "init">("init");

  // Immediately start loading the image
  useEffect(() => {
    setImageLoadState("isLoading");
  }, []);

  return (
    <Box key={id} border="1px solid rgb(219,219,219)">
      {/* <ChImage
        // maxHeight={{ sm: "50px", md: "50px", lg: "50px", xl: "70px" }}
        maxHeight={["400px", "200px", "200px", "700px"]}
        objectFit="cover"
        align="center"
        // fallbackSrc="https://via.placeholder.com/800"
        htmlWidth="100%"
        src={images && images[0] ? images[0].uri : ""}
      /> */}
      <FeedTopBar />

      <FeedBoxedImage
        images={images}
        imageLoadState={imageLoadState}
        setImageLoadState={setImageLoadState}
      />

      <Box px={4} pb={4}>
        <Flex alignItems="center">
          <Box>
            <LikesAndCommentsSummary
              disabled={true}
              comments_count={comments_count}
              currently_liked={currently_liked}
              likes_count={likes_count}
              postId={id ? id : ""}
            />
          </Box>
          <CollectionsButton />
        </Flex>

        <Skeleton isLoaded={!!text}>
          <Text>{text}</Text>
        </Skeleton>
        <Text>{date_formatted} ago</Text>
      </Box>
    </Box>
  );
}
