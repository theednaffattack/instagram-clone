import { Flex, Link } from "@chakra-ui/react";

export default function AccessDenied(): JSX.Element {
  return (
    <Flex flexDirection="column">
      <h1>Access Denied</h1>
      <p>
        <Link
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault();
            // eslint-disable-next-line no-console
            console.log("LINK CLICKED - ACCESS DENIED");
          }}
        >
          You must be signed in to view this page
        </Link>
      </p>
    </Flex>
  );
}
