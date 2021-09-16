import { NextSeo } from "next-seo";
import { AppLayout } from "../components/layout.app";
import { LoginPage } from "../components/login-page";

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

// const HomeUrql: WithUrqlAndLayout = withUrqlClient((_ssrExchange, _ctx) => ({
//   // ...add your Client options here
//   fetchOptions: { credentials: "include" },
//   url: process.env.NEXT_PUBLIC_DEVELOPMENT_GQL_URI,
// }))(Home);

// HomeUrql.layout = AppLayout;

export default Home;

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
