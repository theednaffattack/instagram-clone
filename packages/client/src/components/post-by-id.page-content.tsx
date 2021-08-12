import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Flex,
} from "@chakra-ui/react";

import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { LayoutAuthenticated } from "./layout-authenticated";
import { useGetGlobalPostByIdQuery } from "../generated/graphql";
import { getPathnameValues } from "../lib/get-pathname-values";

import PublicCard from "./post.public-card";

function PostById(): JSX.Element {
  const router = useRouter();

  const {
    data,
    error,
    loading: loadingGlobalPostById,
  } = useGetGlobalPostByIdQuery({
    ssr: false,
    variables: {
      getpostinput: {
        postId: router?.query.postId as string,
      },
    },
  });

  if (error) {
    let pluckedError;
    if (
      error.networkError &&
      error.networkError.name &&
      "result" in error.networkError &&
      error.networkError.result &&
      error.networkError.result.errors.length
    ) {
      pluckedError =
        error.networkError.result.errors.filter((error) =>
          error.message.includes("Your session has expired")
        ).length > 0 ? (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Your session has expired!</AlertTitle>
            <AlertDescription>
              Please{" "}
              <Link href="/" passHref>
                <a>Log in</a>
              </Link>
              .
            </AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
        ) : null;
    }
    return (
      <LayoutAuthenticated>
        <Flex flexDirection="column">{pluckedError}</Flex>
      </LayoutAuthenticated>
    );
  }
  if (loadingGlobalPostById) {
    return <div>loading...</div>;
  }

  function handleClick(
    evt: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ): void {
    evt.preventDefault();
    router.back();
  }

  const { prevPath } = getPathnameValues();

  return (
    <>
      <a href={prevPath} onClick={handleClick}>
        back
      </a>
      <PublicCard cardProps={data.getGlobalPostById} />
    </>
  );
}

export default PostById;