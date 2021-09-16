import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useGetGlobalPostByIdQuery } from "../generated/graphql";
import { getPathnameValues } from "../lib/get-pathname-values";
import { LayoutAuthenticated } from "./layout-authenticated";
import PublicCard from "./post.public-card";

function PostById(): JSX.Element {
  const router = useRouter();

  const [{ data, error, fetching: loadingGlobalPostById }] =
    useGetGlobalPostByIdQuery({
      variables: {
        getpostinput: {
          postId: router?.query.postId as string,
        },
      },
    });

  if (error) {
    if (error.message === "Not authenticated") {
      alert("Not authenticated has been tripped");

      return (
        <LayoutAuthenticated>
          <Flex flexDirection="column">{error.message}</Flex>
        </LayoutAuthenticated>
      );
    } else {
      return (
        <LayoutAuthenticated>
          <Flex flexDirection="column">{JSON.stringify(error, null, 2)}</Flex>
        </LayoutAuthenticated>
      );
    }

    // if (
    //   error &&
    //   error.networkError &&
    //   error.networkError.name &&
    //   hasOwnProperty(error.networkError, "result") &&
    //   "result" in error.networkError &&
    //   error.networkError.result &&
    //   error.networkError.result.errors.length
    // ) {
    //   pluckedError =
    //     error.networkError.result.errors.filter((error) =>
    //       error.message.includes("Your session has expired")
    //     ).length > 0 ? (
    //       <Alert status="error">
    //         <AlertIcon />
    //         <AlertTitle mr={2}>Your session has expired!</AlertTitle>
    //         <AlertDescription>
    //           Please{" "}
    //           <Link href="/" passHref>
    //             <a>Log in</a>
    //           </Link>
    //           .
    //         </AlertDescription>
    //         <CloseButton position="absolute" right="8px" top="8px" />
    //       </Alert>
    //     ) : null;
    // }
    // return (
    //   <LayoutAuthenticated>
    //     <Flex flexDirection="column">{pluckedError}</Flex>
    //   </LayoutAuthenticated>
    // );
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
      <PublicCard cardProps={data?.getGlobalPostById} />
    </>
  );
}

export default PostById;
