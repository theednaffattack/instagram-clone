import { Avatar, Flex, Text } from "@chakra-ui/react";
import React from "react";

interface FeedTopBarProps {
  children: React.ReactNode;
}

export function FeedTopBar({ children }: FeedTopBarProps): JSX.Element {
  return (
    <Flex alignItems="center" pl={4} pr={2} py={3}>
      <Avatar name="Hoshigaki Kisame" tabIndex={0} />
      <Flex flexDirection="column" pl={2}>
        <Text tabIndex={0}>Hoshigaki Kisame</Text>
        <Text tabIndex={0}>Akatski Hideout</Text>
      </Flex>
      {/**
       * TODO: MAKE THIS MENU A MODAL OR... PORTAL, I GUESS??
       */}
      {children}
      {/* <Menu isLazy>
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
              navigator.share({
                title: "web.dev",
                text: "Check out web.dev.",
                url: "https://web.dev/",
              });
            }}
          >
            Share to...
          </MenuItem>
          <MenuItem onClick={() => alert("Notifications pressed")}>
            Turn On Post Notifications
          </MenuItem>
          <MenuItem onClick={() => alert("Mute pressed")}>Mute</MenuItem>
          <MenuItem onClick={() => alert("Unfollow pressed")}>
            Unfollow
          </MenuItem>
        </MenuList>
      </Menu> */}
    </Flex>
  );
}
