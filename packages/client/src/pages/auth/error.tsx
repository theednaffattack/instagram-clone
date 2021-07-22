import { Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import type { Router } from "next/router";
import React from "react";

export default function NextAuthErrorPage({
  router,
}: {
  router: Router;
}): JSX.Element {
  // Will this fix build error ("error" is undefined, perhaps on initial render)
  if (!router.query || !router.query.error) return null;
  const authError = router.query.error;
  const displayErrors = [];

  // If the query param is a string, split
  // on ampersand (each param) and push to
  // an array.
  if (typeof authError === "string") {
    const allErrors = authError.split("&");
    for (const error of allErrors) {
      displayErrors.push(<p>{error}</p>);
    }
  }

  // If the query param is an array of strings, loop
  // over it to pull out each set of params. Split each
  // set of params to get individual parameters and push
  // to the collection.
  if (Array.isArray(authError)) {
    for (const error of authError) {
      const allErrors = error.split("&");

      for (const error of allErrors) {
        displayErrors.push(<p>{error}</p>);
      }
    }
  }
  return (
    <Flex
      flexDirection="column"
      border="2px dashed limegreen"
      justifyContent="center"
      alignItems="center"
    >
      <Heading>Error</Heading>
      <p>
        return to{" "}
        <Link href="/" passHref>
          <a>{process.env.NEXT_PUBLIC_PRODUCTION_BASE_URL}</a>
        </Link>
      </p>
      {displayErrors}
    </Flex>
  );
}
