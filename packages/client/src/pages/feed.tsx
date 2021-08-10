import { css } from "@linaria/core";
import { NextSeo } from "next-seo";
import React from "react";
import { useAuth } from "../components/authentication-provider";
import { PublicFeedCard } from "../components/feed.public-card";
import LayoutMultiState from "../components/layout-multi-state";
import { stack } from "../components/styles";
import { useGetGlobalPostsRelayQuery } from "../generated/graphql";
import { useInfiniteScroll, useLazyLoading } from "../lib/custom-hooks";
import withApollo from "../lib/lib.apollo-client_v2";

const flexContainer = css`
  display: flex;
  flex-direction: columnn;
`;

export function Feed(): JSX.Element {
  const { authState } = useAuth();
  const [infState, setInfState] = React.useState<"idle" | "fetch-more">("idle");

  const initialGlobalPostsVariables = {
    after: null,
    before: null,
    first: 2,
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
    // If there's a next page, cursor in pageInfo.
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

  const scrollSentinelRef = React.useRef<HTMLDivElement>(null);

  useInfiniteScroll(scrollSentinelRef, setInfState);
  return (
    <>
      <NextSeo
        title="Instagram Clone"
        description="A simple clone of Instagram"
        canonical="https://ic.eddienaff.dev/"
        openGraph={{
          url: "https://ic.eddienaff.dev/",
          title: "Welcome",
          description: "Open Graph Description",
          images: [
            {
              url: "https://www.example.ie/og-image-01.jpg",
              width: 800,
              height: 600,
              alt: "Og Image Alt",
            },
            {
              url: "https://www.example.ie/og-image-02.jpg",
              width: 900,
              height: 800,
              alt: "Og Image Alt Second",
            },
            { url: "https://www.example.ie/og-image-03.jpg" },
            { url: "https://www.example.ie/og-image-04.jpg" },
          ],
          site_name: "InstaClone",
        }}
        twitter={{
          handle: "@eddienaff",
          site: "@site",
          cardType: "summary_large_image",
        }}
      />

      {authState.userId ? (
        <div className={stack}>
          {/* <PublicFeed /> */}

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

          <div id="page-bottom-boundary" ref={scrollSentinelRef}></div>
        </div>
      ) : (
        <div className={flexContainer}>Oh no, not authenticated</div>
      )}
    </>
  );
}

Feed.layout = LayoutMultiState;

const FeedApollo = withApollo(Feed);

// FeedApollo.layout = LayoutAuthenticated;

export { FeedApollo, FeedApollo as default };
