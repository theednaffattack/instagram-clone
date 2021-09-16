import {
  Arg,
  Ctx,
  Field,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Publisher,
  PubSub,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription,
  UseMiddleware,
} from "type-graphql";
import { Image } from "./entity.image";
import { Post } from "./entity.post";
import { User } from "./entity.user";
import { PostInput } from "./gql-type.post-input";
import { handleAsyncTs, handleAsyncWithArgs } from "./lib.handle-async";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";
import { logger } from "./lib.logger";
import { isAuth } from "./middleware.is-auth";
import { MyContext } from "./typings";

/**
 * Post type for returns to client
 */
@ObjectType()
export class PostSubType {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  text: string;

  @Field(() => [Image])
  images: Image[];

  @Field(() => User)
  user?: User;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at?: Date;
}

export interface PostPayload {
  id: string;
  title: string;
  text: string;
  images: Image[];
  user: User;

  likes_count?: number;
  comments_count?: number;
  currently_liked?: boolean;
  isCtxUserIdAFollowerOfPostUser?: boolean;
}

@InputType()
export class PostSubInput {
  @Field(() => String)
  sentBy: string;

  @Field(() => String)
  message: string;
}

@Resolver()
export class CreatePost {
  @Subscription(() => PostSubType, {
    topics: ({ context }) => {
      if (!context.userId) {
        throw new Error("Not authorized");
      }

      return "POSTS_FOLLOWERS";
    },

    filter: ({
      payload,
      // args,
      context,
    }: ResolverFilterData<Post, PostInput, MyContext>) => {
      if (!payload) return false;
      // filter for followers;
      if (payload.user.followers.map((user) => user.id).includes(context.userId)) {
        return true;
      } else {
        return false;
      }
    },
    // filter: ({ payload, args }) => args.priorities.includes(payload.priority),
  })
  followingPosts(
    @Root() postPayload: PostPayload,

    @Arg("data") input: PostSubInput
  ): PostPayload {
    return { ...postPayload };
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Post, { name: `createPost` })
  async createPost(
    @Ctx() context: MyContext,

    @PubSub("POSTS_FOLLOWERS") publish: Publisher<PostPayload>,
    @PubSub("POSTS_GLOBAL") publishGlbl: Publisher<PostPayload>,
    @Arg("data", () => PostInput)
    { text, title, images }: PostInput
  ): Promise<PostSubType> {
    const userRepo = context.dbConnection.getRepository(User);

    const [user, userError] = await handleAsyncWithArgs(userRepo.findOne, [
      context.userId,
      { relations: ["images", "posts", "followers"] },
    ]);
    if (userError) {
      handleCatchBlockError(userError);
    }

    // If we can find a user...
    if (user) {
      const newImageRepo = context.dbConnection.getRepository(Image);
      const newImageData: Image[] = images.map((image) => {
        const s3Suffix = ".s3.amazonaws.com";
        const findString = context.config.awsConfig.s3Bucket + s3Suffix;
        const replaceString = context.config.awsConfig.cfCdnDomain;

        return newImageRepo.create({
          uri: `${image.replace(findString, replaceString)}`,
          user: user,
        });
      });

      // save that image to the database
      let newImages: Image[] = [];

      try {
        newImages = await Promise.all(
          newImageData.map(async (newImage) => {
            const [savedImage, newImageError] = await handleAsyncWithArgs(newImageRepo.save, [newImage]);
            if (newImageError) {
              handleCatchBlockError(newImageError);
            }
            return savedImage;
          })
        );

        // add the images to the user.images
        // field / column
        if (newImages !== null && newImages.length > 0) {
          user.images = [...user.images, ...newImages];
        }
      } catch (error) {
        logger.error("ERROR SAVING NEW IMAGE OUTSIDE PROMISE ALL MAP 'let newImages'");
        handleCatchBlockError(error);
      }

      // save the user completing the many-to-one images-to-user
      // relation loop
      const [savedUser, savedUserError] = await handleAsyncWithArgs(userRepo.save, [user]);
      if (savedUserError) {
        handleCatchBlockError(savedUserError);
      }

      // both must be true to create a post, always
      if (newImages.length && savedUser) {
        const postData = {
          text,
          title,
          user: savedUser,
          userId: savedUser.id,
          images: [...newImages],
        };

        const postRepo = context.dbConnection.getRepository(Post);

        const newPostModel = postRepo.create(postData);
        const [newPost, newPostError] = await handleAsyncWithArgs(postRepo.save, [newPostModel]);
        if (newPostError) {
          handleCatchBlockError(newPostError);
        }

        newImages.forEach(async (newSavedImage, imageIndex) => {
          newSavedImage.post = newPost;
          const [, savedNewRepoError] = await handleAsyncWithArgs(newImageRepo.save, [newSavedImage]);
          if (savedNewRepoError) {
            handleCatchBlockError(savedNewRepoError);
          }
        });

        // user!.posts!.push(newPost);
        if (user && user.posts && user.posts.length) {
          user.posts.push(newPost);
        }

        const [, newSavedUserError] = await handleAsyncWithArgs(userRepo.save, [user]);
        if (newSavedUserError) {
          handleCatchBlockError(newSavedUserError);
        }

        // we use myPostPayload because of the subscription
        const myPostPayload: PostPayload = {
          ...newPost,
          likes_count: 0,
          comments_count: 0,
          currently_liked: false,
          isCtxUserIdAFollowerOfPostUser: newPost.user.followers.map((follower: any) => follower.id).includes(user.id),
        };

        // I think this publishes to just our UI.
        const [, publishPostPayloadError] = await handleAsyncWithArgs(publish, [myPostPayload]);
        if (publishPostPayloadError) {
          handleCatchBlockError(publishPostPayloadError);
        }

        // Publish to global posts so everyone sees it.

        const [, publishGlobalPostPayloadError] = await handleAsyncWithArgs(publishGlbl, [myPostPayload]);
        if (publishGlobalPostPayloadError) {
          handleCatchBlockError(publishGlobalPostPayloadError);
        }

        return newPost;
      }
    }
    throw Error("the logged in user could not be found in the database");
  }
}
