const PublicCardDynamic = dynamic(
  () => import("../../components/post.public-card")
);
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Flex,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useSession } from "next-auth/client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Router } from "next/router";
import React from "react";
import { LayoutAuthenticated } from "../../components/layout-authenticated";
import { MeQuery, useGetGlobalPostByIdQuery } from "../../generated/graphql";

type PostByIdProps = {
  router?: Router;
  me: MeQuery;
};

const PostById: NextPage<PostByIdProps> = ({ router }) => {
  const [session] = useSession();
  const {
    data,
    error,
    loading: loadingGlobalPostById,
  } = useGetGlobalPostByIdQuery({
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
              <Link href="/login" passHref>
                <a>Log in</a>
              </Link>
              .
            </AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
        ) : null;
    }
    return (
      <LayoutAuthenticated router={router}>
        <Flex flexDirection="column">{pluckedError}</Flex>
      </LayoutAuthenticated>
    );
  }
  if (loadingGlobalPostById) {
    return <div>loading...</div>;
  }

  return session && <PublicCardDynamic cardProps={data.getGlobalPostById} />;
};

export default PostById;
