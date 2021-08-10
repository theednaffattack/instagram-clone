import { NextSeo } from "next-seo";
import { AppLayout } from "../components/layout.app";
import { LoginPage } from "../components/login-page";
import withApollo from "../lib/lib.apollo-client_v2";

export function Home(): JSX.Element {
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
          site_name: "InstaClone",
        }}
        twitter={{
          handle: "@eddienaff",
          site: "@site",
          cardType: "summary_large_image",
        }}
      />

      <LoginPage />
    </>
  );
}

Home.layout = AppLayout;

const HomeApollo = withApollo(Home);

HomeApollo.layout = AppLayout;

export default HomeApollo;

// export async function getServerSideProps(ctx: MyContext): Promise<{
//   props: {
//     cookie: string;
//     accessToken: string;
//   };
// }> {
//   const findAppCookie = cookies(ctx);
//   const icCookie = findAppCookie[process.env.NEXT_PUBLIC_COOKIE_PREFIX];

//   let accessToken: string;
//   try {
//     accessToken = await requestAccessToken(
//       icCookie,
//       "home -> getServerSideProps"
//     );
//   } catch (error) {
//     logger.error(error);
//   }

//   return { props: { cookie: icCookie, accessToken } };
// }
