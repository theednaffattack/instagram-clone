import { Args, Ctx, Query, Resolver, Root, Subscription, UseMiddleware } from "type-graphql";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";

import { Post } from "./entity.post";
import { GetGlobalPostsInput } from "./gql-type.get-global-posts-input";
import { GlobalPostResponse } from "./gql-type.global-posts-response";
import { MyContext } from "./typings";
import { formatDistance } from "date-fns";
import { isAuth } from "./middleware.is-auth";
import { logger } from "./lib.logger";

@Resolver()
export class GetGlobalPosts {
  // @ts-ignore
  @Subscription((type) => GlobalPostResponse, {
    // the `payload` and `args` are available in the destructured
    // object below `{args, context, payload}`
    nullable: true,
    topics: ({ context }) => {
      if (!context.userId) {
        throw new Error("not authed");
      }
      return "POSTS_GLOBAL";
    },

    // @ts-ignore
    filter: ({ payload, context }: ResolverFilterData<GlobalPostResponse, PostInput>) => {
      return true;
    },
  })
  // this is the actual class method that activates?
  // the subscribe.
  globalPosts(@Root() postPayload: GlobalPostResponse): GlobalPostResponse {
    return postPayload;
  }

  @Query(() => [GlobalPostResponse], {
    name: "getGlobalPosts",
    nullable: true,
  })
  async getGlobalPosts(
    @Ctx() ctx: MyContext,

    @Args()
    { cursor, skip, take }: GetGlobalPostsInput
  ): // @PubSub("GLOBAL_POSTS") publish: Publisher<GlobalPostResponse>
  Promise<GlobalPostResponse[]> {
    const realLimit = Math.min(50, take || 50);

    let currentlyLiked;

    const findPosts = await ctx.dbConnection
      .getRepository(Post)
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.images", "images")
      .leftJoinAndSelect("post.comments", "comments")
      .leftJoinAndSelect("post.user", "user")
      .leftJoinAndSelect("user.followers", "followers")
      .leftJoinAndSelect("post.likes", "likes")
      .leftJoinAndSelect("likes.user", "likeUser")
      .where("post.created_at <= :cursor::timestamp", {
        cursor: formatDate(cursor ? parseISO(cursor) : new Date()),
      })
      .orderBy("post.created_at", "DESC")
      .skip(skip)
      .take(realLimit)
      .getMany();

    const flippedPosts = findPosts.reverse();

    let addFollowerStatusToGlobalPosts = flippedPosts.map((post) => {
      currentlyLiked =
        post && post.likes.length >= 1
          ? post.likes.filter((likeRecord) => {
              return likeRecord.user.id === ctx.userId;
            }).length > 0
          : false;

      let returnThing: GlobalPostResponse = {
        ...post,
        isCtxUserIdAFollowerOfPostUser: post.user.followers.map((follower) => follower.id).includes(ctx.userId),
        likes_count: post.likes.length,
        comments_count: post.comments.length,
        currently_liked: currentlyLiked,
        success: true,
        action: "CREATE",
        date_formatted: formatDistance(post.created_at, new Date()),
      };

      return returnThing;
    });

    // const startCursor = formatDate(cursor ? parseISO(cursor) : new Date());

    // const cursorNoRecordsErrorMessage =
    //   "no 'created_at' record present to create new cursor";

    // const newCursor =
    //   flippedPosts[0] && flippedPosts[0].created_at
    //     ? flippedPosts[0].created_at.toISOString()
    //     : cursorNoRecordsErrorMessage;

    // // get messages before cursor position
    // const postsBeforeCursor =
    //   newCursor === cursorNoRecordsErrorMessage
    //     ? false
    //     : await Post.createQueryBuilder("post")
    //         .leftJoinAndSelect("post.images", "images")
    //         .leftJoinAndSelect("post.comments", "comments")
    //         .leftJoinAndSelect("post.user", "user")
    //         .leftJoinAndSelect("user.followers", "followers")
    //         .leftJoinAndSelect("post.likes", "likes")
    //         .leftJoinAndSelect("likes.user", "likeUser")
    //         .where("post.created_at <= :cursor::timestamp", {
    //           cursor: formatDate(cursor ? parseISO(cursor) : new Date()),
    //         })
    //         .orderBy("post.created_at", "DESC")
    //         .skip(skip)
    //         .take(realLimit)
    //         .getMany();

    // // get messages AFTER cursor position
    // const postsAfterCursor = await Post.createQueryBuilder("post")
    //   .leftJoinAndSelect("post.images", "images")
    //   .leftJoinAndSelect("post.comments", "comments")
    //   .leftJoinAndSelect("post.user", "user")
    //   .leftJoinAndSelect("user.followers", "followers")
    //   .leftJoinAndSelect("post.likes", "likes")
    //   .leftJoinAndSelect("likes.user", "likeUser")
    //   .where("post.created_at >= :cursor::timestamp", {
    //     cursor: formatDate(cursor ? parseISO(cursor) : new Date()),
    //   })
    //   .orderBy("post.created_at", "DESC")
    //   .skip(skip)
    //   .take(realLimit)
    //   .getMany();

    // let relayCompatibleResponse = {
    //   edges: flippedPosts.map((post) => {
    //     const myCurrentlyLiked =
    //       post && post.likes.length >= 1
    //         ? post.likes.filter((likeRecord) => {
    //             return likeRecord.user.id === ctx.userId;
    //           }).length > 0
    //         : false;

    //     return {
    //       node: {
    //         ...post,
    //         isCtxUserIdAFollowerOfPostUser: post.user.followers
    //           .map((follower) => follower.id)
    //           .includes(ctx.userId),
    //         likes_count: post.likes.length,
    //         comments_count: post.comments.length,
    //         currently_liked: myCurrentlyLiked,
    //         success: true,
    //         action: "CREATE",
    //       },
    //     };
    //   }),
    //   pageInfo: {
    //     startCursor, // return inside 'edges'?
    //     endCursor: newCursor, // return inside 'edges'?
    //     hasNextPage: postsAfterCursor.length > 0 ? true : false,
    //     hasPreviousPage:
    //       postsBeforeCursor && postsBeforeCursor.length > 0 ? true : false,
    //   },
    // };

    // await publish(addFollowerStatusToGlobalPosts).catch((error: Error) => {
    //   throw new Error(error.message);
    // });

    return addFollowerStatusToGlobalPosts;
  }
}

const formatDate = (date: any) => format(date, "yyyy-MM-dd HH:mm:ss");
