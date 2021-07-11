import { formatDistance } from "date-fns";
import { Resolver, Query, UseMiddleware, Arg, Ctx } from "type-graphql";
import { Post } from "./entity.post";
import { GetGlobalPostByIdInput } from "./gql-type.get-global-post-by-id-input";
import { GlobalPostResponse } from "./gql-type.global-posts-response";
import { isAuth } from "./middleware.is-auth";
import { MyContext } from "./typings";

@Resolver()
export class GetGlobalPostById {
  @UseMiddleware(isAuth)
  @Query(() => GlobalPostResponse, {
    name: "getGlobalPostById",
    nullable: true,
  })
  async getGlobalPostById(
    @Arg("getpostinput")
    { postId }: GetGlobalPostByIdInput,
    @Ctx() ctx: MyContext
  ): Promise<GlobalPostResponse | null> {
    let singleGlobalPost = await ctx.dbConnection
      .getRepository(Post)
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.images", "images")
      .leftJoinAndSelect("post.comments", "comments")
      .leftJoinAndSelect("post.user", "user")
      .leftJoinAndSelect("post.likes", "likes")
      .leftJoinAndSelect("likes.user", "l_user")
      .where({ id: postId })
      .orderBy("comments.created_at", "ASC")
      .getOne();

    // retrieve post, check if a record exists then determine if it's been
    // liked by the user
    // if the Post record doesn't exist the variable is false
    // if the record does exist but the logged in user is not among the likes...
    // the variable is false. If the user HAS liked the Post the variable is true
    let currentlyLiked =
      singleGlobalPost && singleGlobalPost.likes.length >= 1
        ? singleGlobalPost.likes.filter((likeRecord) => {
            return likeRecord.user.id === ctx.userId;
          }).length > 0
        : false;

    let returnData;

    if (singleGlobalPost) {
      returnData = {
        ...singleGlobalPost,
        likes_count: singleGlobalPost.likes.length,
        comments_count: singleGlobalPost.comments.length,
        currently_liked: currentlyLiked,
        date_formatted: formatDistance(singleGlobalPost.created_at, new Date()),
      };
    }

    if (returnData) {
      return returnData;
    } else {
      return null;
    }
  }
}
