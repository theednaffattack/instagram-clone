import { Stack } from "@chakra-ui/react";
import React from "react";
import Modal from "react-modal";
import {
  GlobalPostResponse,
  Image,
  Like,
  Maybe,
  PostEdge,
  useGetGlobalPostsRelayQuery,
  User,
} from "../generated/graphql";
import { useInfiniteScroll, useLazyLoading } from "../lib/custom-hooks";
import { PublicFeedCard } from "./feed.public-card";
import ModalDynamic from "./public-feed.home-modal";

Modal.setAppElement("#__next");

export type GlobalPostsRelayEdges = Array<
  { __typename?: "PostEdge" } & Pick<PostEdge, "cursor"> & {
      node: { __typename?: "GlobalPostResponse" } & Pick<
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
            Array<{ __typename?: "Image" } & Pick<Image, "id" | "uri">>
          >;
          likes?: Maybe<Array<{ __typename?: "Like" } & Pick<Like, "id">>>;
        };
    }
>;

export function PublicFeed(): JSX.Element {
  const [infState, setInfState] = React.useState<"idle" | "fetch-more">("idle");

  const initialGlobalPostsVariables = {
    after: null,
    before: null,
    first: 20,
    last: null,
  };

  const {
    data: dataPosts,
    loading: loadingPosts,
    // error: errorPosts,
    fetchMore: fetchMorePosts,
  } = useGetGlobalPostsRelayQuery({
    variables: initialGlobalPostsVariables,
  });

  useLazyLoading(".card-img-top", dataPosts?.getGlobalPostsRelay?.edges);

  React.useEffect(() => {
    // If there's a next page, cursor it in.
    if (dataPosts?.getGlobalPostsRelay?.pageInfo?.hasNextPage === true) {
      fetchMorePosts({
        variables: {
          first: initialGlobalPostsVariables.first,
          after:
            dataPosts?.getGlobalPostsRelay?.edges[
              dataPosts?.getGlobalPostsRelay?.edges?.length - 1
            ].cursor,
        },
      });
    }
    // Reset infinite scroller state to "idle", regardless
    // next page state.
    setInfState("idle");
  }, [infState === "fetch-more", fetchMorePosts]);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  useInfiniteScroll(scrollRef, setInfState);

  return (
    <>
      <Stack my={50} spacing="3em">
        {dataPosts
          ? dataPosts.getGlobalPostsRelay?.edges?.map(({ node }) => {
              return (
                <PublicFeedCard
                  key={node.id}
                  cardProps={node}
                  loadingPosts={loadingPosts}
                />
              );
            })
          : ""}

        <div id="page-bottom-boundary" ref={scrollRef}></div>
      </Stack>

      <ModalDynamic dataPosts={dataPosts} loadingPosts={loadingPosts} />
    </>
  );
}
