import { Box, Flex, Skeleton, Text } from "@chakra-ui/core";
import React from "react";
import {
  GlobalPostReturnType,
  Image as ImageType,
  Like,
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
  loadingPosts: boolean;
};

export function PublicPostCard({ cardProps }: CardProps) {
  const {
    created_at,
    comments_count,
    currently_liked,
    id,
    images,
    likes_count,
    text
  } = cardProps;

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
      <Box>
        {images && images[0] ? (
          <img
            className="card-img-top"
            data-srcset={`${images?.[0].uri}?w=480 480w,
          ${images?.[0].uri}?w=640 640w,
          ${images?.[0].uri}?w=768 768w,
          ${images?.[0].uri}?w=1024 1024w`}
            srcSet={`https://loremflickr.com/640/640/cat 480w,
            https://loremflickr.com/800/800/cat 640w,
            https://loremflickr.com/900/900/cat 768w,
            https://loremflickr.com/1200/1200/cat 1024w`}
            sizes="(max-width: 600px) 480px,
          (max-width: 800px) 640px,
          (max-width: 900px) 768px,
              1024px"
            src={images?.[0].uri}
            alt="Alt text of some kind"
            object-fit="cover"
          ></img>
        ) : (
          <img src="https://via.placeholder.com/800" />
        )}
      </Box>
      <Box px={4} pb={4}>
        <Flex alignItems="center">
          <Text mr="auto">{created_at}</Text>
          <LikesAndCommentsSummary
            disabled={true}
            comments_count={comments_count}
            currently_liked={currently_liked}
            likes_count={likes_count}
            postId={id ? id : ""}
          />
        </Flex>
        <Skeleton isLoaded={!!text}>
          <Text>{text}</Text>
        </Skeleton>
      </Box>
    </Box>
  );
}
