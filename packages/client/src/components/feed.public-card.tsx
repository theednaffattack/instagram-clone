import { Box, Flex, Skeleton, Text } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  GlobalPostResponse,
  Image as ImageType,
  Like,
  Maybe,
  User,
} from "../generated/graphql";
import { FeedBoxedImage } from "./feed.boxed-image";
import { CardShareMenu } from "./feed.card-share-menu";
import { FeedTopBar } from "./feed.card-top-bar";
import { ErrorFlash } from "./feed.card.error-flash";
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

export function PublicFeedCard({ cardProps }: CardProps): JSX.Element {
  const {
    comments_count,
    currently_liked,
    date_formatted,
    id,
    images,
    likes_count,
    text,
  } = cardProps;

  const [errorFlashes, setErrorFlashes] =
    useState<"hidden" | "visible">("hidden");

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
      <FeedTopBar>
        <CardShareMenu postTitle={text} />
      </FeedTopBar>

      <FeedBoxedImage
        images={images}
        imageLoadState={imageLoadState}
        setImageLoadState={setImageLoadState}
      />

      <Box position="relative">
        <Flex alignItems="center">
          <Box pl={2}>
            <LikesAndCommentsSummary
              disabled={true}
              comments_count={comments_count}
              currently_liked={currently_liked}
              likes_count={likes_count}
              postId={id ? id : ""}
              setErrorFlashes={setErrorFlashes}
            />
          </Box>
          <CollectionsButton />
        </Flex>

        <Flex
          position="absolute"
          top={0}
          left={0}
          w="100%"
          justifyContent="center"
        >
          {errorFlashes === "visible" ? (
            <ErrorFlash
              errorMessage="Login to vote."
              setErrorFlashes={setErrorFlashes}
            />
          ) : (
            ""
          )}
        </Flex>
        <Box px={4} pb={4}>
          <Skeleton isLoaded={!!text}>
            <Text>{text}</Text>

            <Link
              href={`/?postId=${id}`}
              as={`/post/${id}`}
              passHref
              scroll={false}
            >
              <a>see all</a>
            </Link>
          </Skeleton>
          <Text>{date_formatted} ago</Text>
        </Box>
      </Box>
    </Box>
  );
}
