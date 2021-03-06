import { format, formatDistance, parseISO } from "date-fns";
import { Args, Ctx, Field, ObjectType, Query, Resolver, ResolverFilterData, Root, Subscription } from "type-graphql";
import { Post } from "./entity.post";
import { ConnectionArgs } from "./gql-type.connection-args";
import { GlobalPostResponse } from "./gql-type.global-posts-response";
import { MyContext } from "./typings";

const formatDate = (date: any) => format(date, "yyyy-MM-dd HH:mm:ss");

@ObjectType()
class PaginatedPosts {
  @Field(() => [GlobalPostResponse])
  posts: GlobalPostResponse[];

  @Field()
  hasMore: boolean;
}

@Resolver()
export class GetGlobalPostsSimplePagination {
  @Subscription(() => GlobalPostResponse, {
    // the `payload` and `args` are available in the destructured
    // object below `{args, context, payload}`
    nullable: true,
    topics: ({ context }) => {
      if (!context.userId) {
        throw new Error("not authed");
      }
      return "POSTS_GLOBAL";
    },

    filter: ({ payload, context }: ResolverFilterData<GlobalPostResponse, ConnectionArgs>) => {
      return true;
    },
  })
  // this is the actual class method that activates?
  // the subscribe.
  globalPostsRelay(@Root() postPayload: GlobalPostResponse): GlobalPostResponse {
    return postPayload;
  }

  @Query(() => PaginatedPosts, {
    name: "getGlobalPostsSimplePagination",
    nullable: true,
  })
  async getGlobalPostsSimplePagination(
    @Ctx() ctx: MyContext,

    @Args()
    { after, before, first, last }: ConnectionArgs
  ): Promise<PaginatedPosts> {
    // @PubSub("GLOBAL_POSTS") publish: Publisher<GlobalPostResponse>

    const realLimit = Math.min(50, first || 50);
    const realLimitPlusOne = realLimit + 1;

    const postsQb = ctx.dbConnection
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

    // conditionally apply the cursor
    if (before) {
      postsQb.where("post.created_at <= :cursor::timestamp", {
        cursor: formatDate(before ? parseISO(before) : new Date()),
      });
    }

    // Execute the query
    const findPosts = await postsQb.getMany();

    // We need to remove the extra record we fetched and
    // put these in reverse order.
    const preppedPosts = findPosts.slice(0, realLimit); // .reverse();

    let currentlyLiked;

    // Manually add follower status and whether
    // the user currently likes this post.
    const paginatedReturn: PaginatedPosts = {
      hasMore: findPosts.length === realLimitPlusOne,
      posts: preppedPosts.map((post) => {
        currentlyLiked =
          post && post.likes.length >= 1
            ? post.likes.filter((likeRecord) => {
                return likeRecord.user.id === ctx.userId;
              }).length > 0
            : false;

        const returnThing: GlobalPostResponse = {
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
      }),
    };

    // await publish(addFollowerStatusToGlobalPosts).catch((error: Error) => {
    //   throw new Error(error.message);
    // });

    return paginatedReturn;
  }
}
