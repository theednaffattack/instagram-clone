import { NextSeo } from "next-seo";
import React, { useState } from "react";
import { PublicFeedCard } from "../components/feed.public-card";
import LayoutMultiState from "../components/layout-multi-state";
import { stack } from "../components/styles";
import type { GetGlobalPostsRelayQueryVariables } from "../generated/graphql";
import { useGetGlobalPostsRelayQuery } from "../generated/graphql";
import { useInfiniteScroll, useLazyLoading } from "../lib/custom-hooks";

export function Feed(): JSX.Element {
  const [infState, setInfState] = useState<"idle" | "fetch-more">("idle");

  const pleaseFetch = infState === "fetch-more";

  const initialGlobalPostsVariables = {
    after: null,
    before: null,
    first: 2,
    last: null,
  };

  const [variables, setVariables] = useState<GetGlobalPostsRelayQueryVariables>(
    initialGlobalPostsVariables
  );

  const [{ data: dataPosts, error: errorPosts, fetching: loadingPosts }] =
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

      <div className={stack}>
        {errorPosts ? <p>{JSON.stringify(errorPosts, null, 2)}</p> : null}

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
          : null}

        <div id="page-bottom-boundary" ref={scrollSentinelRef}></div>
      </div>
    </>
  );
}

Feed.layout = LayoutMultiState;

export { Feed as default };
