import { useSession } from "next-auth/client";
import { NextSeo } from "next-seo";
import type { Router } from "next/router";
import React from "react";
import AccessDenied from "../components/access-denied";
import { LayoutAuthenticated } from "../components/layout-authenticated";
import { PublicFeed } from "../components/public-feed";
import { useHasMounted } from "../lib/lib.hooks.has-mounted";

interface FeedProps {
  router: Router;
}

export function Feed({ router }: FeedProps): JSX.Element {
  const [session, loading] = useSession();
  const hasMounted = useHasMounted();

  // // When rendering client side don't display anything until loading is complete
  if (hasMounted === "hasMounted" && loading) return null;

  // // If no session exists, display access denied message
  if (hasMounted === "hasMounted" && !session) {
    return (
      <LayoutAuthenticated router={router}>
        <AccessDenied />
      </LayoutAuthenticated>
    );
  }

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
