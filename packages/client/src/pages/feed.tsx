import { NextSeo } from "next-seo";
import React from "react";
import { LayoutAuthenticated } from "../components/layout-authenticated";
import { Protected } from "../components/protected";
import { PublicFeed } from "../components/public-feed";

export function Feed(): JSX.Element {
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
      <Protected>
        <PublicFeed />
      </Protected>
    </>
  );
}

Feed.layout = LayoutAuthenticated;

export default Feed;
