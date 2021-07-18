import { Avatar, Box, Flex, Link as ChLink } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import React from "react";
import { MeQuery } from "../generated/graphql";

type NavbarProps = {
  dataMe?: MeQuery;
  loadingMe?: boolean;
};

export function NavbarAuthenticated({ dataMe }: NavbarProps): JSX.Element {
  // const router = useRouter();
  // const [logoutFunc] = useLogoutMutation();

  // const [data, setData] = useState(null);

  const fetchData = async () => {
    await axios.post("/api/sign-out");
    // const newData = await req.json();

    // return setData(newData.results);
  };

  const handleClick = (event) => {
    event.preventDefault();
    fetchData();
  };

  // user is not logged in
  let body = (
    <>
      <Link href="/login" passHref>
        <ChLink mr={2}>login</ChLink>
      </Link>
      <Link href="/register" passHref>
        <ChLink mr={2}>register</ChLink>
      </Link>
    </>
  );
  // if (fetchingMe) {
  //   // fetching
  // } else
  if (dataMe?.me) {
    // logged in
    body = (
      <>
        <Link href="/profile" passHref>
          <ChLink mr={2}>
            <Avatar size="md" name={dataMe.me?.username} />
          </ChLink>
        </Link>
        <Link href="/logout" passHref>
          <ChLink
            mr={2}
            onClick={async (evt) => {
              handleClick(evt);
              // to support logging out from all windows
              window.localStorage.setItem("logout", Date.now().toString());
              // await logoutFunc();
              // router.push("/logout");
            }}
          >
            logout
          </ChLink>
        </Link>
        {/* <Button
          bg="transparent"
          border="1px solid gray"
          isLoading={loadingLogout}
          onClick={async () => {
            try {
              await client.resetStore();
            } catch (cacheError) {
              console.warn("ERROR RESET STORE");
            }
            try {
              await logout();
              // router.push("/");
            } catch (logoutError) {
              console.warn("LOGOUT ERROR", logoutError);
            }
          }}
        >
          logout
        </Button> */}
      </>
    );
  }
  return (
    <Flex alignItems="center" bg="papayawhip" p={4}>
      <Box mr={2}>Branding</Box>
      <Box mr={2}>
        <Link href="/" passHref>
          <ChLink mr={2}>home</ChLink>
        </Link>
      </Box>
      <Box mr={2}>
        <Link href="/create-post" passHref>
          <ChLink mr={2}>create post</ChLink>
        </Link>
      </Box>
      <Box mr={2}>
        {/* <Link href="/logout" passHref> */}
        <ChLink
          mr={2}
          onClick={(evt) => {
            evt.preventDefault();
            handleClick(evt);
          }}
        >
          logout
        </ChLink>
        {/* </Link> */}
      </Box>

      <Box ml="auto">{body}</Box>
    </Flex>
  );
}
