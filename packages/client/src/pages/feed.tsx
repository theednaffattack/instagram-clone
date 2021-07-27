import { NextSeo } from "next-seo";
import type { Router } from "next/router";
import React from "react";
import { PublicFeed } from "../components/public-feed";

interface FeedProps {
  router: Router;
}

export function Feed({ router }: FeedProps): JSX.Element {
  return (
    <div>
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
          site_name: "Spotify Clone",
        }}
        twitter={{
          handle: "@eddienaff",
          site: "@site",
          cardType: "summary_large_image",
        }}
      />
      <PublicFeed router={router} />
    </div>
  );
}

export default Feed;
