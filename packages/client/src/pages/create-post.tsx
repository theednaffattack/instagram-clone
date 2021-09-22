import { NextSeo } from "next-seo";
import React from "react";
import CreatePostForm from "../components/create-post-form";
import LayoutMultiState from "../components/layout-multi-state";

function CreatePost(): JSX.Element {
  return (
    <>
      <NextSeo
        title="Instagram Clone - create post"
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

      <CreatePostForm />
    </>
  );
}

CreatePost.layout = LayoutMultiState;

export { CreatePost as default };
