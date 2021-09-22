import { Heading } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import { globalStyles } from "../styles/global-styles";
import { NavIconsBottom } from "./nav-icons-bottom";
import { NavIconsTop } from "./nav-icons-top";
import {
  bottomRow,
  innerGridWrapper,
  middleRow,
  topNav,
  topRow,
} from "./styles";

import dynamic from "next/dynamic";
const ModalDynamic = dynamic(() => import("../components/modal"));
const CreatePostFormDynamic = dynamic(() => import("./create-post-form"));
const PostByIdDynamic = dynamic(() => import("./post-by-id.page-content"));

interface LayoutProps {
  children?: ReactNode;
}

export type OpenModalStates = "postId" | "createPost" | "none";

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
      <>
        <div className={innerGridWrapper + " " + globalStyles} id="auth-grid">
          <div className={topRow} id="top-row">
            <Heading>InstaClone</Heading>
            <nav className={topNav}>
              <NavIconsTop
                router={router}
                open={openModalPage}
                setOpen={setOpenModalPage}
                callerPage={router.pathname}
              />
            </nav>
          </div>

          <div className={middleRow} id="middle">
            {children}
          </div>
          <nav className={bottomRow} id="bottom">
            <NavIconsBottom
              router={router}
              open={openModalPage}
              setOpen={setOpenModalPage}
              callerPage="feed"
            />
          </nav>
        </div>
        <ModalDynamic identifier={pageToOpen}>{modalBody}</ModalDynamic>
      </>
    </>
  );
}

export default LayoutMultiState;
