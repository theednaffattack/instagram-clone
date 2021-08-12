import { format, formatDistance, parseISO } from "date-fns";
import {
  Args,
  Ctx,
  ObjectType,
  Query,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription,
  UseMiddleware,
} from "type-graphql";

import { Post } from "./entity.post";
import { EdgeType, ConnectionType, ConnectionArgs } from "./gql-type.connection-args";
import { GlobalPostResponse } from "./gql-type.global-posts-response";
import { logger } from "./lib.logger";
import { isAuth } from "./middleware.is-auth";
import { MyContext } from "./typings";

const formatDate = (date: any) => format(date, "yyyy-MM-dd HH:mm:ss");

@ObjectType()
export class PostEdge extends EdgeType("user", GlobalPostResponse) {}

@ObjectType()
export class PostConnection extends ConnectionType<PostEdge>("post", PostEdge) {}

@Resolver()
export class GetGlobalPostsRelay {
  // @ts-ignore
  @Subscription((type) => PostConnection, {
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
    filter: ({ payload, context }: ResolverFilterData<PostConnection, ConnectionArgs>) => {
      return true;
    },
  })
  // this is the actual class method that activates?
  // the subscribe.
  globalPostsRelay(@Root() postPayload: PostConnection): PostConnection {
    return postPayload;
  }

  @UseMiddleware(isAuth)
  @Query(() => PostConnection, {
    name: "getGlobalPostsRelay",
    nullable: true,
  })
  async getGlobalPostsRelay(
    @Ctx() ctx: MyContext,

    @Args()
    {
      after,
      // @ts-ignore
      before,
      first,
      // @ts-ignore
      last,
    }: ConnectionArgs
  ): // @PubSub("GLOBAL_POSTS") publish: Publisher<GlobalPostResponse>
  Promise<PostConnection> {
    const realLimit = Math.min(50, first || 50);
    const realLimitPlusOne = realLimit + 1;

    // let currentlyLiked;

    const getPosts = ctx.dbConnection
      .getRepository(Post)
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.images", "images")
      .leftJoinAndSelect("post.comments", "comments")
      .leftJoinAndSelect("post.user", "user")
      .leftJoinAndSelect("user.followers", "followers")
      .leftJoinAndSelect("post.likes", "likes")
      .leftJoinAndSelect("likes.user", "likeUser")
      .orderBy("post.created_at", "DESC")
      // .skip(first)
      .take(realLimitPlusOne);

    if (after !== null) {
      getPosts.where("post.created_at <= :cursor::timestamp", {
        cursor: formatDate(after ? parseISO(after) : new Date()),
      });
    }

    let findPosts;
    try {
      findPosts = await getPosts.getMany();
    } catch (error) {
      logger.error("ERROR FINDING POSTS - GET POSTS: RELAY");
      logger.error(error);
      throw new Error(error);
    }

    // const flippedPosts = findPosts.reverse();
    const preppedPosts = findPosts.slice(0, realLimit); // .reverse();

    const startCursor = formatDate(after ? parseISO(after) : new Date());

    const cursorNoRecordsErrorMessage = "no 'created_at' record present to create new cursor";

    const newCursor =
      preppedPosts[preppedPosts.length - 1] && preppedPosts[preppedPosts.length - 1].created_at
        ? preppedPosts[preppedPosts.length - 1].created_at.toISOString()
        : cursorNoRecordsErrorMessage;

    let relayCompatibleResponse: PostConnection = {
      edges: preppedPosts.map((post) => {
        const myCurrentlyLiked =
          post && post.likes.length >= 1
            ? post.likes.filter((likeRecord) => {
                return likeRecord.user.id === ctx.userId;
              }).length > 0
            : false;

        return {
          cursor: post.created_at.toISOString(),
          node: {
            ...post,
            isCtxUserIdAFollowerOfPostUser: post.user.followers.map((follower) => follower.id).includes(ctx.userId),
            likes_count: post.likes.length,
            comments_count: post.comments.length,
            currently_liked: myCurrentlyLiked,
            date_formatted: formatDistance(post.created_at, new Date()),
            success: true,
            action: "CREATE",
          },
        };
      }),
      pageInfo: {
        startCursor,
        endCursor: newCursor,
        hasNextPage: findPosts.length === realLimitPlusOne,
        hasPreviousPage: false,
        // postsBeforeCursor && postsBeforeCursor.length > 0 ? true : false,
      },
    };

    // await publish(addFollowerStatusToGlobalPosts).catch((error: Error) => {
    //   throw new Error(error.message);
    // });

    return relayCompatibleResponse;
  }
}
