import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { NextRouter } from "next/router";
import React from "react";
import { OpenModalStates } from "./layout-multi-state";
import { ProfileMenu } from "./profile.menu";
import { SvgPathKey, svgPaths } from "./svg-paths";

export interface NavLinkAttrs {
  linkHref: string;
  linkAs: string;
  svgKey: SvgPathKey;
  svgViewbox: string;
  svgOverrides?: {
    [key: string]: number | string;
  };
  text: SvgPathKey;
}

export function NavIconsBottom({
  callerPage = "feed",
}: {
  open: OpenModalStates;
  setOpen: React.Dispatch<React.SetStateAction<OpenModalStates>>;
  callerPage: string;
  router: NextRouter;
}): JSX.Element {
  const navLinkInfo: NavLinkAttrs[] = [
    {
      linkHref: `/feed`,
      linkAs: "/feed",
      svgKey: "home",
      svgViewbox: "0 0 1024 1024",
      text: "home",
    },

    {
      linkHref: `/${callerPage}?search=open`,
      linkAs: "/search",
      svgKey: "search",
      svgViewbox: "0 0 16 16",
      text: "search",
    },
    {
      linkHref: `/${callerPage}?reels=open`,
      linkAs: "/reels",
      svgKey: "reels",
      svgViewbox: "0 0 16 16",
      text: "reels",
    },
    {
      linkHref: `/${callerPage}?shop=open`,
      linkAs: "/shop",
      svgKey: "shop",
      svgViewbox: "0 0 24 24",
      text: "shop",
    },
    {
      linkHref: `/${callerPage}?profile=open`,
      linkAs: "/profile",
      svgKey: "profile",
      svgViewbox: "0 0 24 24",
      text: "profile",
    },
  ];
  const bottomNav = navLinkInfo.map(
    ({ linkHref, svgKey, svgViewbox }, index) => {
      if (svgKey === "profile") {
        return (
          <div key={`${svgKey}-${index}`}>
            <Flex flexDirection="column" alignItems="center">
              <ProfileMenu>
                <Box maxWidth="2em">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox={svgViewbox ? svgViewbox : "0 0 24 24"}
                    color="currentColor"
                    aria-hidden="true"
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ color: "currentColor" }}
                    width="100%"
                  >
                    {svgPaths[svgKey]}
                  </svg>
                </Box>
              </ProfileMenu>
            </Flex>
          </div>
        );
      }
      return (
        <div key={`${svgKey}-${index}`}>
          {linkHref ? (
            <Link passHref href={linkHref}>
              <a className="chakra-button css-10wuup2" tabIndex={0}>
                <Flex flexDirection="column" alignItems="center">
                  <Box maxWidth="2em">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox={svgViewbox ? svgViewbox : "0 0 24 24"}
                      color="currentColor"
                      aria-hidden="true"
                      focusable="false"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ color: "currentColor" }}
                      width="100%"
                    >
                      {svgPaths[svgKey]}
                    </svg>
                  </Box>

                  {/* <p className={navIconText}>{svgKey}</p> */}
                </Flex>
              </a>
            </Link>
          ) : null}
        </div>
      );
    }
  );
  return <>{bottomNav}</>;
}
