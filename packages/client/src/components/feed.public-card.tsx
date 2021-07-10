import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import {
  GlobalPostResponse,
  Image as ImageType,
  Like,
  Maybe,
  User,
} from "../generated/graphql";
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

function handleImageLoaded(
  dispatch: React.Dispatch<
    React.SetStateAction<"isLoaded" | "isLoading" | "init">
  >
) {
  dispatch("isLoaded");
}

export function PublicPostCard({ cardProps }: CardProps): JSX.Element {
  const {
    created_at,
    comments_count,
    currently_liked,
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
      <Flex alignItems="center" pl={4} pr={2} py={3}>
        <Avatar name="Hoshigaki Kisame" tabIndex={0} />
        <Flex flexDirection="column" pl={2}>
          <Text tabIndex={0}>Oshigaki Kisame</Text>
          <Text tabIndex={0}>LOCATION TEXT</Text>
        </Flex>
        {/**
         * TODO: MAKE THIS MENU A MODAL OR... PORTAL, I GUESS??
         */}
        <Menu isLazy>
          <MenuButton
            aria-label="more"
            as={IconButton}
            bg="transparent"
            ml="auto"
            icon={<BiDotsHorizontalRounded fill="grey" size={28} />}
          >
            Open menu
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Text color="crimson">Report</Text>
            </MenuItem>
            <MenuItem onClick={() => alert("Copy Link pressed")}>
              Copy Link
            </MenuItem>
            <MenuItem onClick={() => alert("Share to... pressed")}>
              Share to...
            </MenuItem>
            <MenuItem onClick={() => alert("Notifications pressed")}>
              Turn On Post Notifications
            </MenuItem>
            <MenuItem onClick={() => alert("Mute pressed")}>Mute</MenuItem>
            <MenuItem onClick={() => alert("Unfollow pressed")}>
              Unfollow
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Box>
        {images && images[0] ? (
          <>
            <img
              alt={images[0].__typename + "-" + images[0].id}
              key={images[0].id}
              src={images[0].uri}
              object-fit="cover"
              onLoad={(evt: React.SyntheticEvent<HTMLImageElement, Event>) => {
                evt.preventDefault();
                handleImageLoaded(setImageLoadState);
              }}
              onError={() => {
                setImageLoadState("isError");
              }}
              style={imageLoadState === "isLoaded" ? null : { display: "none" }}
            />
            {imageLoadState !== "isLoaded" ? (
              <img
                alt={`${images[0].id}-alt`}
                key={`${images[0].id}-placeholder`}
                object-fit="cover"
                src="https://via.placeholder.com/800"
              />
            ) : null}
          </>
        ) : (
          // <img
          //   className="card-img-top"
          //   data-srcset={`${images?.[0].uri}?w=480 480w,
          // ${images?.[0].uri}?w=640 640w,
          // ${images?.[0].uri}?w=768 768w,
          // ${images?.[0].uri}?w=1024 1024w`}
          //   srcSet={`https://loremflickr.com/640/640/cat 480w,
          //   https://loremflickr.com/800/800/cat 640w,
          //   https://loremflickr.com/900/900/cat 768w,
          //   https://loremflickr.com/1200/1200/cat 1024w`}
          //   sizes="(max-width: 600px) 480px,
          // (max-width: 800px) 640px,
          // (max-width: 900px) 768px,
          //     1024px"
          //   src={images?.[0].uri}
          //   alt="Alt text of some kind"
          //   object-fit="cover"
          // ></img>
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
