import { NextSeo } from "next-seo";
import { Router } from "next/router";
import { AppLayout } from "../components/layout.app";
import { Login } from "../components/login-page";

interface HomeProps {
  router: Router;
}

export function Home({ router }: HomeProps): JSX.Element {
  const { error, field, message } = router.query;
  // const { error } = useRouter().query;
  // eslint-disable-next-line no-console
  console.log("VIEW ERROR");
  // eslint-disable-next-line no-console
  console.log(error);

  return (
    <>
      <NextSeo
        title="Instagram Clone"
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
      TOP LEVEL ERROR: {JSON.stringify({ field, message }, null, 2)}
      <Login router={router} />
    </>
  );
}

Home.layout = AppLayout;

export default Home;
