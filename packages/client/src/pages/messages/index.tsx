import cookies from "next-cookies";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "../../components/authentication-provider";
import { LayoutAuthenticated } from "../../components/layout-authenticated";
import { MessagesPageContent } from "../../components/messages.page-content";
import { withApollo } from "../../lib/lib.apollo-client_v2";
import { logger } from "../../lib/lib.logger";
import { requestAccessToken } from "../../lib/lib.request-server-access-token";
import { MyContext } from "../../lib/types";
import { isServer } from "../../lib/utilities.is-server";

export function Messages(): JSX.Element {
  const { authState } = useAuth();
  const { push } = useRouter();

  if (authState.userId) {
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

        <MessagesPageContent />
      </>
    );
  } else {
    if (!isServer()) {
      push("/?message=Not authenticated", "/");
      return null;
    }
    if (isServer()) {
      return null;
    }
  }
}

Messages.layout = LayoutAuthenticated;

const FinalMessages = withApollo(Messages);

FinalMessages.layout = LayoutAuthenticated;

export default FinalMessages;

export async function getServerSideProps(ctx: MyContext): Promise<{
  props: {
    cookie: string;
    accessToken: string;
  };
}> {
  const findAppCookie = cookies(ctx);
  const icCookie = findAppCookie[process.env.NEXT_PUBLIC_COOKIE_PREFIX];

  let accessToken: string;
  try {
    accessToken = await requestAccessToken(
      icCookie,
      "messages -> getServerSideProps"
    );
  } catch (error) {
    logger.error(error);
  }

  return { props: { cookie: icCookie, accessToken } };
}
