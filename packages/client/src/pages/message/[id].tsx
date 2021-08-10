import { Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { LayoutAuthenticated } from "../../components/layout-authenticated";
import { useGetGlobalPostByIdQuery } from "../../generated/graphql";
import withApollo from "../../lib/lib.apollo-client_v2";

function MessageById(): JSX.Element {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const { data, error, loading } = useGetGlobalPostByIdQuery({
    variables: {
      getpostinput: {
        postId: id as string,
      },
    },
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
}

MessageById.layout = LayoutAuthenticated;

const MessageByIdApollo = withApollo(MessageById);

export default MessageByIdApollo;
