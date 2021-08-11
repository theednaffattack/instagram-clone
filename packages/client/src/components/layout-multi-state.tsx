import dynamic from "next/dynamic";
import { NextRouter, useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import { globalStyles } from "../styles/global-styles";
import ModalDynamic from "./modal";
import {
  bottomRow,
  innerGridWrapper,
  middleRow,
  topNav,
  topRow,
} from "./styles";

const CreatePostFormDynamic = dynamic(() => import("./create-post-form"));
const PostByIdDynamic = dynamic(() => import("./post-by-id.page-content"));

interface LayoutProps {
  children?: ReactNode;
}

type OpenModalStates = "postId" | "createPost" | "none";

function LayoutMultiState({ children }: LayoutProps): JSX.Element {
  const [openModalPage, setOpenModalPage] = useState<OpenModalStates>("none");
  const router = useRouter();
  const tmpQuery = router.query;

  const pageCache: OpenModalStates[] = [];
  for (const [key, value] of Object.entries(tmpQuery)) {
    if (value === "open") {
      pageCache.push(key as OpenModalStates);
    }
    if (key === "postId" && typeof value === "string") {
      pageCache.push(key as OpenModalStates);
    }
  }

  const [pageToOpen] = pageCache;
  let modalBody;
  if (pageToOpen && pageToOpen === "createPost") {
    modalBody = <CreatePostFormDynamic />;
  }
  if (pageToOpen && pageToOpen === "postId") {
    modalBody = <PostByIdDynamic />;
  }
  return (
    <>
      <div className={innerGridWrapper + " " + globalStyles}>
        <div className={topRow}>
          <p>InstaClone</p>
          <nav className={topNav}>
            <HomeTopNavIcons
              router={router}
              open={openModalPage}
              setOpen={setOpenModalPage}
              callerPage="feed"
            />
          </nav>
        </div>

        <div className={middleRow}>{children}</div>
        <nav className={bottomRow}>
          <HomeBottomNavIcons
            router={router}
            open={openModalPage}
            setOpen={setOpenModalPage}
            callerPage="feed"
          />
        </nav>
      </div>

      <ModalDynamic identifier={pageToOpen}>{modalBody}</ModalDynamic>
    </>
  );
}

export default LayoutMultiState;

function HomeBottomNavIcons({
  callerPage = "feed",
}: {
  open: OpenModalStates;
  setOpen: React.Dispatch<React.SetStateAction<OpenModalStates>>;
  callerPage: string;
  router: NextRouter;
}): JSX.Element {
  const bottomNav = [
    {
      linkHref: `/feed`,
      linkAs: "/feed",
      svgKey: "home",
      svgViewbox: "0 0 1024 1024",
      text: "home",
    },

    {
      link: `/${callerPage}?search=open`,
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
  ].map(({ linkHref, text, svgKey, svgViewbox }, index) => (
    <div
      color="#e2e8f0"
      className="css-70qvj9"
      key={`nav-link-${linkHref}-${index}`}
    >
      <button
        type="button"
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
          style={{ color: "currentColor" }}
        >
          {svgPaths[svgKey]}
        </svg>
      </button>
    </div>
  ));
  return <>{bottomNav}</>;
}

function HomeTopNavIcons({
  callerPage = "feed",
  router,
}: {
  open: OpenModalStates;
  setOpen: React.Dispatch<React.SetStateAction<OpenModalStates>>;
  callerPage: string;
  router: NextRouter;
}): JSX.Element {
  const navLinkInfo = [
    {
      linkHref: `/${callerPage}?createPost=open`,
      linkAs: `/create-post`,
      svgKey: "create",
      svgViewbox: "0 0 16 16",
      text: "post",
    },
    {
      link: `/${callerPage}?following=open`,
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
  ].map(({ linkHref, svgKey, svgViewbox, text, svgOverrides }, index) => (
    <div className="css-70qvj9" key={`top-nav-link-${linkHref}-${index}`}>
      <button
        type="button"
        className="chakra-button css-10wuup2"
        aria-label={`Open ${text}`}
        tabIndex={0}
        onClick={() => {
          //
          router.push(linkHref);
        }}
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
      </button>
    </div>
  ));
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>{navLinkInfo}</div>
  );
}

const svgPaths = {
  create: (
    <>
      <path
        fillRule="evenodd"
        d="M8 3.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H4a.5.5 0 010-1h3.5V4a.5.5 0 01.5-.5z"
        clipRule="evenodd"
      ></path>
      <path
        fillRule="evenodd"
        d="M7.5 8a.5.5 0 01.5-.5h4a.5.5 0 010 1H8.5V12a.5.5 0 01-1 0V8z"
        clipRule="evenodd"
      ></path>
      <path
        fillRule="evenodd"
        d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z"
        clipRule="evenodd"
      ></path>
    </>
  ),
  following: (
    <>
      <path d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8 264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path>
    </>
  ),
  home: (
    <path d="M946.5 505L534.6 93.4a31.93 31.93 0 0 0-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3 0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8 24.9-25 24.9-65.5-.1-90.5z"></path>
  ),
  messages: (
    <>
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </>
  ),
  search: (
    <>
      <path
        fillRule="evenodd"
        d="M10.442 10.442a1 1 0 011.415 0l3.85 3.85a1 1 0 01-1.414 1.415l-3.85-3.85a1 1 0 010-1.415z"
        clipRule="evenodd"
      ></path>
      <path
        fillRule="evenodd"
        d="M6.5 12a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM13 6.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
        clipRule="evenodd"
      ></path>
    </>
  ),
  shop: (
    <path
      fill="none"
      stroke="currentColor" //"#000"
      strokeLinecap="round"
      strokeWidth="2"
      d="M4,7 L20,7 L20,23 L4,23 L4,7 Z M8,9 L8,5 C8,2.790861 9.79535615,1 12,1 L12,1 C14.209139,1 16,2.79535615 16,5 L16,9"
    ></path>
  ),
  reels: (
    <>
      <path
        fillRule="evenodd"
        d="M14.5 13.5h-13A.5.5 0 011 13V6a.5.5 0 01.5-.5h13a.5.5 0 01.5.5v7a.5.5 0 01-.5.5zm-13 1A1.5 1.5 0 010 13V6a1.5 1.5 0 011.5-1.5h13A1.5 1.5 0 0116 6v7a1.5 1.5 0 01-1.5 1.5h-13zM2 3a.5.5 0 00.5.5h11a.5.5 0 000-1h-11A.5.5 0 002 3zm2-2a.5.5 0 00.5.5h7a.5.5 0 000-1h-7A.5.5 0 004 1z"
        clipRule="evenodd"
      ></path>
      <path
        fillRule="evenodd"
        d="M6.258 6.563a.5.5 0 01.507.013l4 2.5a.5.5 0 010 .848l-4 2.5A.5.5 0 016 12V7a.5.5 0 01.258-.437z"
        clipRule="evenodd"
      ></path>
    </>
  ),
  profile: (
    <>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 12 21Z"
        fill="currentColor"
      ></path>
    </>
  ),
};
