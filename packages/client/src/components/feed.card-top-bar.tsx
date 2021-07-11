import {
  Avatar,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { BiDotsHorizontalRounded } from "react-icons/bi";

export function FeedTopBar(): JSX.Element {
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
          <MenuItem onClick={() => alert("Share to... pressed")}>
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
      </Menu>
    </Flex>
  );
}
