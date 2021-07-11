import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";

export function CardShareMenu({
  postTitle,
}: {
  postTitle: string;
}): JSX.Element {
  const siteTitle = "Instagram Clone";
  return (
    <Menu isLazy>
      <MenuButton
        aria-label="more"
        as={IconButton}
        bg="transparent"
        ml="auto"
        icon={<BiDotsHorizontalRounded fill="grey" size={28} />}
      >
        Open menu
      </MenuButton>
      <MenuList>
        <MenuItem>
          <Text color="crimson">Report</Text>
        </MenuItem>
        <MenuItem onClick={() => alert("Copy Link pressed")}>
          Copy Link
        </MenuItem>
        <MenuItem
          onClick={(event) => {
            event.preventDefault();
            handleClick({ postTitle, siteTitle });
          }}
        >
          Share to...
        </MenuItem>
        <MenuItem onClick={() => alert("Notifications pressed")}>
          Turn On Post Notifications
        </MenuItem>
        <MenuItem onClick={() => alert("Mute pressed")}>Mute</MenuItem>
        <MenuItem onClick={() => alert("Unfollow pressed")}>Unfollow</MenuItem>
      </MenuList>
    </Menu>
  );
}

interface HandleClickProps {
  postTitle: string;
  siteTitle: string;
}

function handleClick({ postTitle, siteTitle }: HandleClickProps): void {
  const theHell =
    typeof window !== "undefined" ? navigator.platform.toUpperCase() : "NOPE";
  if (typeof window !== "undefined" && navigator.share) {
    navigator
      .share({
        title: "`${postTitle} | ${siteTitle}`,",
        text: `Check out ${postTitle} on ${siteTitle}`,
        url: document.location.href,
      })
      .then(() => {
        // eslint-disable-next-line no-console
        console.log("Successfully shared");
      })
      .finally(() => {
        // eslint-disable-next-line no-console
        console.log("Finally");
      })
      .catch((error) => {
        console.error("Something went wrong sharing the blog", error);
      });
  } else {
    alert(theHell);
  }
}
