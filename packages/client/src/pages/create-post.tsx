import { NextSeo } from "next-seo";
import React from "react";
import { useAuth } from "../components/authentication-provider";
import CreatePostForm from "../components/create-post-form";
import { LayoutAuthenticated } from "../components/layout-authenticated";
import { flexContainer } from "../components/styles";
import withApollo from "../lib/lib.apollo-client_v2";

function CreatePost(): JSX.Element {
  const { authState } = useAuth();

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
      {authState.userId ? (
        <>
          <CreatePostForm />
        </>
      ) : (
        <div className={flexContainer}>Oh no, not authenticated</div>
      )}
    </>
  );
}

CreatePost.layout = LayoutAuthenticated;

const CreatePostApollo = withApollo(CreatePost);

CreatePostApollo.layout = LayoutAuthenticated;

export default CreatePostApollo;
