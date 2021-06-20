import { Flex, Heading, Image, Text } from "@chakra-ui/core";
import { NextPage } from "next";
import { Router } from "next/router";
import React from "react";
import { useGetGlobalPostByIdQuery } from "../../generated/graphql";

interface MessageByIdProps {
  router: Router;
}

const MessageById: NextPage<MessageByIdProps> = ({ router }) => {
  const {
    query: { id }
  } = router;
  const { data, error, loading } = useGetGlobalPostByIdQuery({
    variables: {
      getpostinput: {
        postId: id as string
      }
    }
  });
  return (
    <Flex>
      {loading ? <Text>loading... </Text> : null}
      <Heading>{data?.getGlobalPostById?.title}</Heading>
      {data?.getGlobalPostById?.images?.map((image) => {
        return <Image key={image.id} src={image.uri} />;
      })}
      <Text>{data?.getGlobalPostById?.text}</Text>
      <Text>{error ? error : ""}</Text>
    </Flex>
  );
};

export default MessageById;
