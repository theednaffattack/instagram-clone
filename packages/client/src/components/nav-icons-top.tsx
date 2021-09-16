import Link from "next/link";
import { NextRouter } from "next/router";
import React from "react";
import { OpenModalStates } from "./layout-multi-state";
import { NavLinkAttrs } from "./nav-icons-bottom";
import { svgPaths } from "./svg-paths";

export function NavIconsTop({
  callerPage = "feed",
}: {
  open: OpenModalStates;
  setOpen: React.Dispatch<React.SetStateAction<OpenModalStates>>;
  callerPage: string;
  router: NextRouter;
}): JSX.Element {
  const navLinkInfo: NavLinkAttrs[] = [
    {
      linkHref: `/${callerPage}?createPost=open`,
      linkAs: `/create-post`,
      svgKey: "create",
      svgViewbox: "0 0 16 16",
      text: "create",
    },
    {
      linkHref: `/${callerPage}?following=open`,
      linkAs: `/following`,
      svgKey: "following",
      svgViewbox: "0 0 1024 1024",
      text: "following",
    },
    {
      linkHref: `/messages`,
      linkAs: "/messages",
      svgKey: "messages",
      svgViewbox: "0 0 24 24",
      text: "messages",
      svgOverrides: {
        fill: "none",
        strokeWidth: 2,
      },
    },
  ];

  const topNav = navLinkInfo.map(
    ({ linkHref, svgKey, svgViewbox, text, svgOverrides }, index) => (
      <div className="css-70qvj9" key={`top-nav-link-${linkHref}-${index}`}>
        {linkHref ? (
          <Link passHref href={linkHref}>
            <a
              // type="button"
              className="chakra-button css-10wuup2"
              aria-label={`Open ${text}`}
              tabIndex={0}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox={svgViewbox ? svgViewbox : "0 0 24 24"}
                color="currentColor"
                aria-hidden="true"
                focusable="false"
                height="2em"
                width="2em"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: "currentcolor" }}
                {...svgOverrides}
              >
                {svgPaths[svgKey]}
              </svg>
            </a>
          </Link>
        ) : null}
      </div>
    )
  );
  return <div style={{ display: "flex", flexDirection: "row" }}>{topNav}</div>;
}
