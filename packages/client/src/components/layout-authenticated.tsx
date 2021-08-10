import { Box, Flex, Grid, Heading, Link, Text } from "@chakra-ui/react";
import NavLink from "next/link";
import { NextRouter, useRouter } from "next/router";
import type { MouseEvent, ReactNode } from "react";
import * as React from "react";
import { useLogoutMutation } from "../generated/graphql";
import { setAccessToken } from "../lib/lib.access-token";
import { logger } from "../lib/lib.logger";
import { useAuth } from "./authentication-provider";

export interface LayoutAuthenticatedProps {
  children?: ReactNode;
}

async function handleLogout(
  evt: MouseEvent<HTMLAnchorElement>,
  logoutFunc: any,
  push: NextRouter["push"],
  signOut: () => void
) {
  evt.preventDefault();

  // Set our global var to an empty string
  setAccessToken("");

  // Call logout function to unset cookies.
  let logoutResponse;
  try {
    logoutResponse = await logoutFunc();
  } catch (error) {
    logger.error(error);
    throw new Error("Error logging out.");
  }

  // Update localStorage 'logout' to sign out from all windows
  window.localStorage.setItem("logout", Date.now().toString());

  // Sign out func
  signOut();
  // Logout response should be a boolean.
  if (logoutResponse) {
    push("/");
  }
}

export function LayoutAuthenticated({
  children,
}: LayoutAuthenticatedProps): JSX.Element {
  const { signOut } = useAuth();
  const { push } = useRouter();
  const [logoutFunc] = useLogoutMutation();
  const maxie = 1000;

  return (
    <>
      <Grid
        color="rgba(38,38,38,1)"
        height="54px"
        w="100%"
        borderBottom="1px solid rgba(219,219,219,1)"
        position="fixed"
        top={0}
        zIndex={9}
        bg="rgba(255,255,255,1)"
        placeItems="center center"
      >
        <Flex
          alignItems="center"
          height="100%"
          maxWidth={`${maxie}px`}
          width="100%"
        >
          <Heading>Instagram (clone)</Heading>

          <Flex ml="auto">
            {navLinks.map(({ href, name }) => {
              return (
                <Box key={href} mx={2}>
                  <NavLink href={href} passHref>
                    <Link>
                      <Text>{name}</Text>
                    </Link>
                  </NavLink>
                </Box>
              );
            })}
            <Box>
              <Link
                onClick={async (evt) =>
                  handleLogout(evt, logoutFunc, push, signOut)
                }
              >
                <Text>logout</Text>
              </Link>
            </Box>
          </Flex>
        </Flex>
      </Grid>
      <Grid
        placeItems="center center"
        width="100%"
        height="100%"
        paddingTop="52px"
      >
        <Grid
          width="100%"
          maxWidth={`${maxie}px`}
          gridTemplateColumns={{
            sm: "1fr",
            md: "1fr",
            lg: "1fr 250px",
            xl: "1fr 250px",
          }}
          height="100%"
          position="relative"
        >
          {children}
          <div>
            <Flex
              flexDirection="column"
              position="fixed"
              maxW="250px"
              width={[0, 0, "100%", "100%"]}
              top={0}
              // right={0}
              right="calc(50% - 500px)"
            >
              {navLinks.map(({ href, name }) => {
                return (
                  <Box key={href}>
                    <NavLink href={href} passHref>
                      <Link>
                        <Text>{name}</Text>
                      </Link>
                    </NavLink>
                  </Box>
                );
              })}
              <Box>
                <Link
                  onClick={async (evt) =>
                    handleLogout(evt, logoutFunc, push, signOut)
                  }
                >
                  <Text>logout</Text>
                </Link>
              </Box>
            </Flex>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

const navLinks = [
  {
    href: "/create-post",
    name: "create post",
  },
  {
    href: "/feed",
    name: "home",
  },
  {
    href: "/messages",
    name: "messages",
  },
];
