import { Box, Flex, Grid, Heading, Link, Text } from "@chakra-ui/react";
import axios from "axios";
import NavLink from "next/link";
import { Router } from "next/router";
import * as React from "react";
import { signOut } from "next-auth/client";
import { PropsWithChildren } from "react";

interface LayoutAuthenticatedProps {
  isNOTLgScreen?: boolean;
  router: Router;
}

const logMeOut = async (evt?) => {
  evt.preventDefault();
  await axios.post("/api/sign-out");
  // const newData = await req.json();

  // return setData(newData.results);
};

export function LayoutAuthenticated({
  children,
}: PropsWithChildren<LayoutAuthenticatedProps>): JSX.Element {
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
                // href={
                //   process.env.NODE_ENV !== "production"
                //     ? process.env.NEXTAUTH_URL
                //     : process.env.PRODUCTION_AUTH_URL
                // }
                onClick={async (evt) => {
                  evt.preventDefault();
                  try {
                    await logMeOut(evt);
                  } catch (error) {
                    console.error(error);
                  }

                  try {
                    await signOut({
                      callbackUrl: `${
                        process.env.NODE_ENV !== "production"
                          ? process.env.NEXTAUTH_URL
                          : process.env.PRODUCTION_AUTH_URL
                      }/login`,
                    });
                  } catch (error) {
                    console.error(error);
                  }
                  // to support logging out from all windows
                  window.localStorage.setItem("logout", Date.now().toString());

                  // try {
                  //   await logoutFunc();
                  // } catch (error) {
                  //   console.error(error);
                  // }
                  // router.push("/");
                }}
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
                  // href={
                  //   process.env.NODE_ENV !== "production"
                  //     ? process.env.NEXTAUTH_URL
                  //     : process.env.PRODUCTION_AUTH_URL
                  // }
                  onClick={async (evt) => {
                    evt.preventDefault();

                    try {
                      await logMeOut();
                    } catch (error) {
                      console.error(error);
                    }

                    // Final Sign out
                    try {
                      await signOut({
                        callbackUrl: `${
                          process.env.NODE_ENV !== "production"
                            ? process.env.NEXTAUTH_URL
                            : process.env.PRODUCTION_AUTH_URL
                        }/login`,
                      });
                    } catch (error) {
                      console.error(error);
                    }
                    // // to support logging out from all windows
                    // window.localStorage.setItem(
                    //   "logout",
                    //   Date.now().toString()
                    // );

                    // try {
                    //   await logoutFunc();
                    // } catch (error) {
                    //   console.error(error);
                    // }
                    // router.push("/");
                  }}
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
