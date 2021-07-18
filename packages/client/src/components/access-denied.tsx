import { Flex, Link } from "@chakra-ui/react";
import { signIn } from "next-auth/client";

export default function AccessDenied(): JSX.Element {
  return (
    <Flex flexDirection="column">
      <h1>Access Denied</h1>
      <p>
        <Link
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          You must be signed in to view this page
        </Link>
      </p>
    </Flex>
  );
}
