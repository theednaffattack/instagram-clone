import {
  Avatar,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useGetMessagesByThreadIdQuery } from "../generated/graphql";

export function MessagesByThreadId({
  threadId,
}: {
  threadId: string;
}): JSX.Element {
  const [{ data, error, fetching }] = useGetMessagesByThreadIdQuery({
    variables: {
      input: {
        threadId,
        take: 15,
      },
    },
  });

  if (data || fetching) {
    return (
      <>
        {data?.getMessagesByThreadId?.edges?.map(({ node }) => {
          const isItMe = node.sentBy.id === "" ? "IT_IS_ME" : "IT_IS_NOT_ME";
          if (isItMe === "IT_IS_ME") {
            return (
              <Flex
                mt="auto"
                padding="6"
                boxShadow="lg"
                bg="white"
                key={node.id}
              >
                {fetching ? (
                  <SkeletonCircle size="10" />
                ) : (
                  <Avatar src={node?.sentBy?.profileImageUri ?? undefined} />
                )}

                {fetching ? (
                  <SkeletonText mt="4" noOfLines={4} spacing="4" />
                ) : (
                  <Text>{node.text}</Text>
                )}
              </Flex>
            );
          } else {
            return (
              <Flex
                mt="auto"
                padding="6"
                boxShadow="lg"
                bg="white"
                key={node.id}
              >
                {fetching ? (
                  <SkeletonText mt="4" noOfLines={4} spacing="4" />
                ) : (
                  <Flex flexWrap="wrap">
                    <Text>{node.text}</Text>
                  </Flex>
                )}
                {fetching ? (
                  <SkeletonCircle size="10" />
                ) : (
                  <Avatar
                    ml="auto"
                    src={node.sentBy.profileImageUri || undefined}
                  />
                )}
              </Flex>
            );
          }
        })}
      </>
    );
  } else {
    return (
      <>
        <Flex padding="6" boxShadow="lg" bg="white">
          <Avatar size="10" />
          <Text>{error}</Text>
        </Flex>
        <div>ERROR: {JSON.stringify(error, null, 2)}</div>
      </>
    );
  }
}
