import { Box, Flex, Grid, Heading, Link, Text } from "@chakra-ui/core";
import NavLink from "next/link";
import * as React from "react";

export function LayoutAuthenticated({
  children
}: {
  children: React.ReactChild | React.ReactChildren;
  isNOTLgScreen?: boolean;
}) {
  // const [isNOTLgScreen, isBrowser] = useMediaQuery("(max-width: 62em)");
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
        zIndex={20}
        bg="rgba(255,255,255,1)"
        placeItems="center center"
      >
        <Flex
          alignItems="center"
          height="100%"
          maxWidth={`${maxie}px`}
          width="100%"
        >
          <Heading>Branding</Heading>
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
            xl: "1fr 250px"
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
                  <Box key={href} border="2px dashed crimson">
                    <NavLink href={href} passHref>
                      <Link>
                        <Text>{name}</Text>
                      </Link>
                    </NavLink>
                  </Box>
                );
              })}
            </Flex>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

const navLinks = [
  // {
  //   href: "/feed",
  //   name: "feed"
  // },
  // {
  //   href: "/likes",
  //   name: "likes"
  // },
  // {
  //   href: "/discover",
  //   name: "discover"
  // },
  {
    href: "/create-post",
    name: "create post"
  },
  {
    href: "/",
    name: "home"
  },
  {
    href: "/messages",
    name: "messages"
  }
];
