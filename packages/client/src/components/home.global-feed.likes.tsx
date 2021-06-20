import {
  Alert,
  AlertIcon,
  AlertTitle,
  IconButton,
  CloseButton,
  Flex,
  Text
} from "@chakra-ui/core";
import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import {
  GetGlobalPostsRelayDocument,
  GetGlobalPostsRelayQuery,
  GetGlobalPostsRelayQueryVariables,
  useCreateOrUpdateLikesMutation
} from "../generated/graphql";

type LikesAndCommentsSummaryProps = {
  comments_count: number;
  currently_liked: boolean;
  likes_count: number;
  postId: string;
  disabled?: boolean;
};

export function LikesAndCommentsSummary({
  comments_count,
  currently_liked,
  disabled,
  likes_count,
  postId
}: LikesAndCommentsSummaryProps) {
  const [errorFlashes, setErrorFlashes] = useState<"hidden" | "visible">(
    "hidden"
  );
  const [createOrUpdateLikes] = useCreateOrUpdateLikesMutation({
    variables: { input: { postId } }
  });

  return (
    <>
      <Flex>
        {errorFlashes === "visible" ? (
          <ErrorFlash
            errorMessage="Login to vote."
            setErrorFlashes={setErrorFlashes}
          />
        ) : (
          ""
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-around">
        <Flex alignItems="center">
          {currently_liked ? (
            <IconButton
              icon={<AiFillHeart fill="crimson" size="2em" />}
              type="button"
              aria-label="Like button"
              bg="transparent"
              disabled={disabled}
              onClick={async () => {
                try {
                  await createOrUpdateLikes({
                    update(cache) {
                      const existing = cache.readQuery<
                        GetGlobalPostsRelayQuery,
                        GetGlobalPostsRelayQueryVariables
                      >({
                        query: GetGlobalPostsRelayDocument,
                        variables: {
                          after: null,
                          before: null,
                          first: 2,
                          last: null
                        }
                      });

                      const returnObj: GetGlobalPostsRelayQuery = {
                        __typename: existing?.__typename,
                        getGlobalPostsRelay: {
                          __typename: existing?.getGlobalPostsRelay?.__typename,
                          edges: existing!.getGlobalPostsRelay!.edges.map(
                            (edge) => {
                              if (edge.node.id === postId) {
                                return {
                                  ...edge,
                                  cursor: edge.cursor,
                                  node: {
                                    comments_count: comments_count,
                                    likes_count: edge.node.likes_count - 1,
                                    currently_liked: false,
                                    likes: edge.node.likes,
                                    created_at: edge.node.created_at,
                                    __typename: edge.node.__typename,
                                    images: edge.node.images,
                                    text: edge.node.text,
                                    title: edge.node.title,
                                    id: edge.node.id
                                  }
                                };
                              } else {
                                return edge;
                              }
                            }
                          ),
                          pageInfo: existing!.getGlobalPostsRelay!.pageInfo
                        }
                      };

                      cache.writeQuery<
                        GetGlobalPostsRelayQuery,
                        GetGlobalPostsRelayQueryVariables
                      >({
                        data: returnObj,
                        query: GetGlobalPostsRelayDocument,
                        variables: {
                          after: null,
                          before: null,
                          first: 2,
                          last: null
                        }
                      });
                    }
                  });
                } catch (error) {
                  console.log(
                    "UPDATE LIKES ERROR - CURRENTLY LIKED",
                    error.message
                  );
                }
              }}
            />
          ) : (
            <IconButton
              icon={<AiOutlineHeart fill="#888" size="2em" />}
              type="button"
              aria-label="Like button"
              bg="transparent"
              disabled={disabled}
              onClick={async () => {
                try {
                  await createOrUpdateLikes({
                    update(cache) {
                      const existing = cache.readQuery<
                        GetGlobalPostsRelayQuery,
                        GetGlobalPostsRelayQueryVariables
                      >({
                        query: GetGlobalPostsRelayDocument,
                        variables: {
                          after: null,
                          before: null,
                          first: 2,
                          last: null
                        }
                      });

                      const updatedCacheData: GetGlobalPostsRelayQuery = {
                        __typename: existing?.__typename,
                        getGlobalPostsRelay: {
                          __typename: existing?.getGlobalPostsRelay?.__typename,
                          edges: existing!.getGlobalPostsRelay!.edges.map(
                            (edge) => {
                              if (edge.node.id === postId) {
                                return {
                                  ...edge,
                                  cursor: edge.cursor,
                                  node: {
                                    comments_count: comments_count,
                                    likes_count: edge.node.likes_count + 1,
                                    currently_liked: true,
                                    likes: edge.node.likes,
                                    created_at: edge.node.created_at,
                                    __typename: edge.node.__typename,
                                    images: edge.node.images,
                                    text: edge.node.text,
                                    title: edge.node.title,
                                    id: edge.node.id
                                  }
                                };
                              } else {
                                return edge;
                              }
                            }
                          ),
                          pageInfo: existing!.getGlobalPostsRelay!.pageInfo
                        }
                      };

                      cache.writeQuery<
                        GetGlobalPostsRelayQuery,
                        GetGlobalPostsRelayQueryVariables
                      >({
                        data: updatedCacheData,
                        query: GetGlobalPostsRelayDocument,
                        variables: {
                          after: null,
                          before: null,
                          first: 2,
                          last: null
                        }
                      });
                    }
                  });
                } catch (error) {
                  console.log(
                    "UPDATE LIKES ERROR - NOT CURRENTLY LIKED",
                    error.message
                  );
                  if (error.message === "Not authenticated") {
                    setErrorFlashes("visible");
                  }
                }
              }}
            />
          )}

          <Text fontSize="1.3em">{likes_count}</Text>
        </Flex>

        <Flex alignItems="center">
          <IconButton
            aria-label="comment button"
            bg="transparent"
            disabled
            icon={<FaRegComment fill="#888" size="1.8em" />}
            type="button"
          />

          <Text fontSize="1.3em">{comments_count ? comments_count : "0"}</Text>
        </Flex>
      </Flex>
    </>
  );
}

type ErrorFlashProps = {
  errorMessage: string;
  setErrorFlashes: React.Dispatch<React.SetStateAction<"hidden" | "visible">>;
};

function ErrorFlash({ errorMessage, setErrorFlashes }: ErrorFlashProps) {
  return (
    <Alert
      flexDirection="column"
      justifyContent="center"
      textAlign="center"
      status="error"
    >
      <Flex>
        <AlertIcon />
        <AlertTitle mr={2}>{errorMessage}</AlertTitle>
      </Flex>
      {/* <AlertDescription>{flash}</AlertDescription> */}
      <CloseButton
        position="absolute"
        right="8px"
        top="8px"
        disabled={!errorMessage}
        onClick={() => setErrorFlashes("hidden")}
      />
    </Alert>
  );
}
