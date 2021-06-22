import { CloseButton, Stack } from "@chakra-ui/react";
import { Router } from "next/router";
import React from "react";
import Modal from "react-modal";
import { PostCard } from "../components/feed.home.card";
import { LayoutAuthenticated } from "../components/layout-authenticated";
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
import { PublicPostCard } from "./feed.public-card";

Modal.setAppElement("#__next");

type IndexProps = { router: Router };

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

export function PublicFeed({ router }: IndexProps): JSX.Element {
  const [infState, setInfState] = React.useState<"idle" | "fetch-more">("idle");

  const initialGlobalPostsVariables = {
    after: null,
    before: null,
    first: 10,
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
    <LayoutAuthenticated>
      <>
        <Stack my={50} spacing="3em">
          {dataPosts
            ? dataPosts.getGlobalPostsRelay?.edges?.map(({ node }) => {
                return (
                  <PublicPostCard
                    key={node.id}
                    cardProps={node}
                    loadingPosts={loadingPosts}
                  />
                );
              })
            : ""}

          <div id="page-bottom-boundary" ref={scrollRef}></div>
        </Stack>
        <Modal
          isOpen={!!router.query.postId}
          onRequestClose={() => router.push("/")}
          style={{
            overlay: {
              backgroundColor: "rgba(0,0,0,0.25)",
              position: "fixed",
              top: 0,
              bottom: 0,
            },

            // content: {
            //   color: "lightsteelblue"
            // }
          }}
        >
          <CloseButton size="sm" onClick={() => router.push("/")} />
          {dataPosts?.getGlobalPostsRelay?.edges
            .filter(({ node: { id } }) => router.query.postId === id)
            .map(({ node }) => (
              <PostCard key={node.id} cardProps={node} />
            ))}
        </Modal>
      </>
    </LayoutAuthenticated>
  );
}
