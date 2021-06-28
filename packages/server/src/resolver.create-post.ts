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
    // do some stuff
    console.log("VIEW INPUT (likesUpdated subscriber func)", input);
    console.log("VIEW LIKES PAYLOAD (likesUpdated subscriber func)", postPayload);
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
    let user: User | undefined;

    try {
      user = await userRepo.findOne(context.userId, {
        relations: ["images", "posts", "followers"],
      });
    } catch (error) {
      console.error("ERROR SELECTING USER - CREATE POST");
      console.error(error);
      throw Error(error);
    }

    // If we can find a user...
    if (user) {
      const newImageRepo = context.dbConnection.getRepository(Image);
      const newImageData: Image[] = images.map((image) => {
        return newImageRepo.create({
          uri: `${image}`,
          user: user,
        });
      });

      // save that image to the database
      let newImages: Image[];

      try {
        newImages = await Promise.all(
          newImageData.map(async (newImage) => {
            try {
              return await newImageRepo.save(newImage);
            } catch (error) {
              console.error("ERROR SAVING NEW IMAGE INSIDE PROMISE ALL MAP 'let newImages'");
              console.error(error);
              throw Error(error);
            }
          })
        );
      } catch (error) {
        console.error("ERROR SAVING NEW IMAGE OUTSIDE PROMISE ALL MAP 'let newImages'");
        console.error(error);
        throw Error(error);
      }
      // add the images to the user.images
      // field / column
      if (newImages !== null && newImages.length > 0) {
        user.images = [...user.images, ...newImages];
      }

      // save the user completing the many-to-one images-to-user
      // relation loop
      let savedUser;

      try {
        savedUser = await userRepo.save(user);
      } catch (error) {
        console.error("ERROR SAVING USER AFTER SAVING IMAGES");
        console.error(error);
        throw Error(`Error saving user.`);
      }

      // both must be true to create a post, always
      if (newImages.length && savedUser) {
        const postData = {
          text,
          title,
          user,
          images: [...newImages],
        };

        let newPost: Post;
        const postRepo = context.dbConnection.getRepository(Post);

        try {
          const newPostModel = postRepo.create(postData);
          newPost = await postRepo.save(newPostModel);
        } catch (error) {
          console.error("ERROR SAVING NEW POST");
          console.error(error);
          throw Error(error);
        }

        newImages.forEach(async (newSavedImage, imageIndex) => {
          newSavedImage.post = newPost;
          try {
            await newImageRepo.save(newSavedImage);
          } catch (error) {
            console.error("ERROR SAVING NEW IMAGE", { imageIndex, newSavedImage });
            console.error(error);
            throw Error(error);
          }
        });

        // user!.posts!.push(newPost);
        if (user && user.posts && user.posts.length) {
          user.posts.push(newPost);
        }

        try {
          await userRepo.save(user);
        } catch (error) {
          console.error("ERROR SAVING USER AFTER SAVING POST");
          console.error(error);
          throw Error(error);
        }
        // we use myPostPayload because of the subscription
        let myPostPayload: PostPayload = {
          ...newPost,
          likes_count: 0,
          comments_count: 0,
          currently_liked: false,
          isCtxUserIdAFollowerOfPostUser: newPost.user.followers.map((follower) => follower.id).includes(user.id),
        };

        // I think this publishes to just our UI.
        try {
          await publish(myPostPayload);
        } catch (error) {
          console.error(error);
          throw Error(error);
        }

        // Publish to global posts so everyone sees it.
        try {
          await publishGlbl(myPostPayload);
        } catch (error) {
          console.error(error);
          throw Error(error);
        }

        return newPost;
      }
    }
    throw Error("the logged in user could not be found in the database");
  }
}
