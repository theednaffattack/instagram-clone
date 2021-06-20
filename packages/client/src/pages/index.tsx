import { NextSeo } from "next-seo";
import { Router } from "next/router";
import { AudioPlayer } from "../components/audio-player";
import { AppLayout } from "../components/layout.app";
import { PublicFeed } from "../components/public-feed";

interface HomeProps {
  router: Router;
}

export function Home({ router }: HomeProps): JSX.Element {
  return (
    <>
      <NextSeo
        title="Spotify Clone"
        description="It's just an audio player"
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
      <AudioPlayer />

      <button
        onClick={() => {
          window.alert("With typescript and Jest");
        }}
      >
        Test Button
      </button>
      <PublicFeed router={router} />
    </>
  );
}

Home.layout = AppLayout;

export default Home;
