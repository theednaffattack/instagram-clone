import { MutationFunctionOptions } from "@apollo/client";
import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import {
  CreateOrUpdateLikesMutation,
  Exact,
  GetGlobalPostsRelayDocument,
  GetGlobalPostsRelayQuery,
  GetGlobalPostsRelayQueryVariables,
  UpdateLikesInput,
  useCreateOrUpdateLikesMutation,
} from "../generated/graphql";

type LikesAndCommentsSummaryProps = {
  comments_count: number;
  currently_liked: boolean;
  disabled?: boolean;
  likes_count: number;
  postId: string;
  setErrorFlashes: React.Dispatch<React.SetStateAction<"hidden" | "visible">>;
};

export function LikesAndCommentsSummary({
  comments_count,
  currently_liked,
  disabled,
  postId,
  setErrorFlashes,
}: LikesAndCommentsSummaryProps): JSX.Element {
  const [createOrUpdateLikes] = useCreateOrUpdateLikesMutation({
    variables: { input: { postId } },
  });

  return (
    <>
      <Flex alignItems="center" justifyContent="space-around">
        <Flex alignItems="center">
          {currently_liked ? (
            <IconButton
              icon={<AiFillHeart fill="crimson" size="2em" />}
              type="button"
              aria-label="Like button"
              bg="transparent"
              // disabled={disabled}
              onClick={() => {
                if (disabled) {
                  setErrorFlashes("visible");
                } else {
                  handleClick({
                    createOrUpdateLikes,
                    setErrorFlashes,
                    comments_count,
                    postId,
                  });
                }
              }}
              tabIndex={0}
            />
          ) : (
            <IconButton
              icon={<AiOutlineHeart color="currentColor" size="2em" />}
              color={disabled ? "#ccc" : "#888"}
              type="button"
              aria-label="Like button"
              bg="transparent"
              onClick={() => {
                if (disabled) {
                  setErrorFlashes("visible");
                } else {
                  handleClick({
                    createOrUpdateLikes,
                    setErrorFlashes,
                    comments_count,
                    postId,
                  });
                }
              }}
              tabIndex={0}
            />
          )}
        </Flex>

        <Flex alignItems="center">
          <IconButton
            aria-label="comment button"
            bg="transparent"
            color={disabled ? "#ccc" : "#888"}
            icon={<FaRegComment color="currentColor" size="1.8em" />}
            type="button"
            tabIndex={0}
            onClick={() => {
              if (disabled) {
                setErrorFlashes("visible");
              } else {
                alert("Comment clicked");
              }
            }}
          />
        </Flex>
        <Flex>
          <IconButton
            aria-label="Send a message"
            bg="transparent"
            color={disabled ? "#ccc" : "#888"}
            icon={<FiSend color="currentColor" size="1.8em" />}
            type="button"
            onClick={() => {
              if (disabled) {
                setErrorFlashes("visible");
              } else {
                alert("Send a message clicked");
              }
            }}
          />
        </Flex>
      </Flex>
    </>
  );
}

interface HandleClickProps {
  createOrUpdateLikes: (
    options?: MutationFunctionOptions<
      CreateOrUpdateLikesMutation,
      Exact<{
        input: UpdateLikesInput;
      }>
    >
  ) => Promise<any>;
  setErrorFlashes: any;
  postId: string;
  comments_count: number;
}

async function handleClick({
  createOrUpdateLikes,
  setErrorFlashes,
  comments_count,
  postId,
}: HandleClickProps) {
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
            last: null,
          },
        });

        const updatedCacheData: GetGlobalPostsRelayQuery = {
          __typename: existing?.__typename,
          getGlobalPostsRelay: {
            __typename: existing?.getGlobalPostsRelay?.__typename,
            edges: existing.getGlobalPostsRelay.edges.map((edge) => {
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
                    id: edge.node.id,
                    date_formatted: edge.node.date_formatted,
                  },
                };
              } else {
                return edge;
              }
            }),
            pageInfo: existing.getGlobalPostsRelay.pageInfo,
          },
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
            last: null,
          },
        });
      },
    });
  } catch (error) {
    console.error("UPDATE LIKES ERROR - NOT CURRENTLY LIKED", error.message);
    if (error.message === "Not authenticated") {
      setErrorFlashes("visible");
    }
  }
}
