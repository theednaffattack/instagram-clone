import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import type { OperationContext, OperationResult } from "@urql/core";
import {
  CreateOrUpdateLikesMutation,
  Exact,
  UpdateLikesInput,
  useCreateOrUpdateLikesMutation,
} from "../generated/graphql";
import { logger } from "../lib/lib.logger";
import type {
  ErrorFlashReducerAction,
  ErrorFlashState,
} from "./feed.public-card";

type LikesAndCommentsSummaryProps = {
  comments_count: number;
  currently_liked: boolean;
  disabled?: boolean;
  likes_count: number;
  postId: string;
  // setErrorFlashes: React.Dispatch<React.SetStateAction<"hidden" | "visible">>;
  dispatchErrorFlash: React.Dispatch<ErrorFlashReducerAction>;
  errorFlash: ErrorFlashState;
};

type CreateOrUpdateLikesFunc = (
  variables?:
    | Exact<{
        input: UpdateLikesInput;
      }>
    | undefined,
  context?: Partial<OperationContext> | undefined
) => Promise<
  OperationResult<
    CreateOrUpdateLikesMutation,
    Exact<{ input: UpdateLikesInput }>
  >
>;

export function LikesAndCommentsSummary({
  comments_count,
  currently_liked,
  disabled,
  postId,
  // setErrorFlashes,
  dispatchErrorFlash,
}: LikesAndCommentsSummaryProps): JSX.Element {
  const [, createOrUpdateLikes] = useCreateOrUpdateLikesMutation();

  return (
    <>
      <Flex alignItems="center" justifyContent="space-around">
        <Flex alignItems="center">
          {currently_liked ? (
            <IconButton
              icon={<AiFillHeart fill="crimson" size="2em" />}
              type="button"
              aria-label="Favorite button"
              bg="transparent"
              // disabled={disabled}
              onClick={() => {
                if (disabled) {
                  dispatchErrorFlash({ type: "clicked-disabled-favorite" });
                  // setErrorFlashes("visible");
                } else {
                  handleClick({
                    createOrUpdateLikes,
                    dispatchErrorFlash,
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
                  dispatchErrorFlash({ type: "clicked-disabled-favorite" });
                } else {
                  handleClick({
                    createOrUpdateLikes,
                    dispatchErrorFlash,
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
                dispatchErrorFlash({ type: "clicked-disabled-comment" });
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
                dispatchErrorFlash({
                  type: "clicked-disabled-message",
                });
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
  createOrUpdateLikes: CreateOrUpdateLikesFunc;
  postId: string;
  comments_count: number;
  dispatchErrorFlash: React.Dispatch<ErrorFlashReducerAction>;
}

async function handleClick({
  createOrUpdateLikes,
  // comments_count,
  postId,
  dispatchErrorFlash,
}: HandleClickProps): Promise<void> {
  try {
    await createOrUpdateLikes({
      input: { postId },
    });
  } catch (error) {
    logger.error("UPDATE LIKES ERROR - NOT CURRENTLY LIKED");
    logger.error({ error });
    if (error instanceof Error) {
      if (error.message === "Not authenticated") {
        dispatchErrorFlash({ type: "clicked-disabled-favorite" });
      }
    }
    if (typeof error === "string") {
      if (error === "Not authenticated") {
        dispatchErrorFlash({ type: "clicked-disabled-favorite" });
      }
    }
  }
}

// update(cache) {
//   const existing = cache.readQuery<
//     GetGlobalPostsRelayQuery,
//     GetGlobalPostsRelayQueryVariables
//   >({
//     query: GetGlobalPostsRelayDocument,
//     variables: {
//       after: null,
//       before: null,
//       first: 2,
//       last: null,
//     },
//   });

//   const updatedCacheData: GetGlobalPostsRelayQuery = {
//     __typename: existing?.__typename,
//     getGlobalPostsRelay: {
//       __typename: existing?.getGlobalPostsRelay?.__typename,
//       edges: existing.getGlobalPostsRelay.edges.map((edge) => {
//         if (edge.node.id === postId) {
//           return {
//             ...edge,
//             cursor: edge.cursor,
//             node: {
//               comments_count: comments_count,
//               likes_count: edge.node.likes_count + 1,
//               currently_liked: true,
//               likes: edge.node.likes,
//               created_at: edge.node.created_at,
//               __typename: edge.node.__typename,
//               images: edge.node.images,
//               text: edge.node.text,
//               title: edge.node.title,
//               id: edge.node.id,
//               date_formatted: edge.node.date_formatted,
//             },
//           };
//         } else {
//           return edge;
//         }
//       }),
//       pageInfo: existing.getGlobalPostsRelay.pageInfo,
//     },
//   };

//   cache.writeQuery<
//     GetGlobalPostsRelayQuery,
//     GetGlobalPostsRelayQueryVariables
//   >({
//     data: updatedCacheData,
//     query: GetGlobalPostsRelayDocument,
//     variables: {
//       after: null,
//       before: null,
//       first: 2,
//       last: null,
//     },
//   });
// },
