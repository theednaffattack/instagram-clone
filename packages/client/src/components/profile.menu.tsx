import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React from "react";
import type { ReactNode } from "react";
import Link from "next/link";

interface ProfileMenuProps {
  children: ReactNode;
}

export function ProfileMenu({ children }: ProfileMenuProps): JSX.Element {
  return (
    <Menu isLazy>
      <MenuButton
        aria-label="more"
        as={IconButton}
        bg="transparent"
        ml="auto"
        icon={children}
      >
        Open menu
      </MenuButton>
      <MenuList>
        <MenuItem>
          <Link href="/logout" passHref>
            <a>
              <Text color="crimson">Logout</Text>
            </a>
          </Link>
        </MenuItem>

        <MenuItem>Profile</MenuItem>
      </MenuList>
    </Menu>
  );
}
