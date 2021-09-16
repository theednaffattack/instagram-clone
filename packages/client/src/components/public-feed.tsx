import { Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import Modal from "react-modal";
import {
  GetGlobalPostsRelayQueryVariables,
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
// import ModalDynamic from "./public-feed.home-modal";

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

  const pleaseFetch = infState === "fetch-more";

  const initialGlobalPostsVariables = {
    after: null,
    before: null,
    first: 20,
    last: null,
  };

  const [variables, setVariables] = useState<GetGlobalPostsRelayQueryVariables>(
    initialGlobalPostsVariables
  );

  const [{ data: dataPosts, fetching: fetchingPosts }] =
    useGetGlobalPostsRelayQuery({
      variables,
    });

  useLazyLoading(".card-img-top", dataPosts?.getGlobalPostsRelay?.edges);

  React.useEffect(() => {
    // If there's a next page, cursor in pageInfo.
    // TODO:
    // 1 -  Should 'dataPosts...' go in the 'useEffect' dependency array?
    // 2 -  Should either of the setState functions go in
    //      the 'useEffect' dependency array?
    if (dataPosts?.getGlobalPostsRelay?.pageInfo?.hasNextPage === true) {
      // This kicks off another query as the variables have changed
      setVariables({
        first: 5,
        after: null,
        before: dataPosts?.getGlobalPostsRelay?.pageInfo.endCursor,
        last: null,
      });
    }
    // Reset the scroll state
    setInfState("idle");
  }, [
    pleaseFetch,
    setVariables,
    dataPosts?.getGlobalPostsRelay?.pageInfo.endCursor,
    dataPosts?.getGlobalPostsRelay?.pageInfo?.hasNextPage,
  ]);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  useInfiniteScroll(scrollRef, setInfState);

  return (
    <>
      <Stack spacing="3em">
        {dataPosts
          ? dataPosts.getGlobalPostsRelay?.edges?.map(({ node }) => {
              return (
                <PublicFeedCard
                  key={node.id}
                  cardProps={node}
                  loadingPosts={fetchingPosts}
                />
              );
            })
          : ""}

        <div id="page-bottom-boundary" ref={scrollRef}></div>
      </Stack>

      {/* <ModalDynamic dataPosts={dataPosts} loadingPosts={loadingPosts} /> */}
    </>
  );
}
