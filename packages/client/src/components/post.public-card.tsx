import { Box, Flex, Skeleton, Text } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useReducer, useState } from "react";
import { GetGlobalPostByIdQuery } from "../generated/graphql";
import { FeedBoxedImage } from "./feed.boxed-image";
import { CardShareMenu } from "./feed.card-share-menu";
import { FeedTopBar } from "./feed.card-top-bar";
import { ErrorFlash } from "./feed.card.error-flash";
import { CollectionsButton } from "./feed.collections-button";
import {
  errFlashReducer,
  initErrorFlashState,
  initialErrorFlashState,
} from "./feed.public-card";
import { LikesAndCommentsSummary } from "./home.global-feed.likes";

type CardProps = {
  cardProps: GetGlobalPostByIdQuery["getGlobalPostById"];
};

export default function PostPublicCard({ cardProps }: CardProps): JSX.Element {
  const {
    comments_count,
    currently_liked,
    date_formatted,
    likes_count,
    id,
    images,
    text,
  } = cardProps;

  const [errorFlash, dispatchErrorFlash] = useReducer(
    errFlashReducer,
    initialErrorFlashState,
    initErrorFlashState
  );

  const [imageLoadState, setImageLoadState] =
    useState<"isLoaded" | "isLoading" | "isError" | "init">("init");

  // Immediately start loading the image
  useEffect(() => {
    setImageLoadState("isLoading");
  }, []);

  return (
    <Box key={id} border="1px solid rgb(219,219,219)">
      <FeedTopBar>
        <CardShareMenu postTitle={text} />
      </FeedTopBar>

      <FeedBoxedImage
        images={images}
        imageLoadState={imageLoadState}
        setImageLoadState={setImageLoadState}
      />

      <Box
        w="100%"
        px={0}
        pb={4}
        position="relative"
        border="2px solid limegreen"
      >
        <Flex alignItems="center">
          <Box>
            <LikesAndCommentsSummary
              disabled={true}
              comments_count={comments_count}
              currently_liked={currently_liked}
              likes_count={likes_count}
              postId={id ? id : ""}
              dispatchErrorFlash={dispatchErrorFlash}
              errorFlash={errorFlash}
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
          {errorFlash.visibility === "visible" ? (
            <ErrorFlash
              errorMessage="Login to vote."
              dispatchErrorFlash={dispatchErrorFlash}
            />
          ) : (
            ""
          )}
        </Flex>

        <Skeleton isLoaded={!!text}>
          <Text>{text}</Text>

          <Link href={`/?postId=${id}`} as={`/post/${id}`} passHref>
            <a>Post ID: {id}</a>
          </Link>
        </Skeleton>
        <Text>{date_formatted} ago</Text>
      </Box>
    </Box>
  );
}

export { PostPublicCard };
