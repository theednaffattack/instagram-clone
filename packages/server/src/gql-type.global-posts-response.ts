import { ObjectType, Field, Int, ID } from "type-graphql";
import { Like } from "./entity.like";
import { User } from "./entity.user";
import { Comment } from "./entity.comment";
import { Image } from "./entity.image";

@ObjectType()
export class GlobalPostResponse {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  text: string;

  @Field(() => [Image], { nullable: true })
  images: Image[];

  @Field(() => [Like], { nullable: true })
  likes: Like[];

  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => Date, { nullable: true })
  created_at: Date;

  @Field(() => Date, { nullable: true })
  updated_at?: Date;

  @Field(() => Boolean, { nullable: true })
  isCtxUserIdAFollowerOfPostUser: boolean;

  @Field(() => Int, { nullable: false })
  comments_count: number;

  @Field(() => Int, { nullable: false })
  likes_count: number;

  @Field(() => Boolean, { nullable: false })
  currently_liked: boolean;

  @Field(() => Boolean, { nullable: true })
  success?: boolean;

  @Field(() => String, { nullable: true })
  action?: string;

  @Field(() => String, { nullable: true })
  date_formatted: string;
}

@ObjectType()
export class FollowingPostReturnType {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field({ nullable: true })
  title: string;

  @Field({ nullable: true })
  text: string;

  @Field(() => [Image], { nullable: true })
  images: Image[];

  @Field(() => [Like], { nullable: true })
  likes: Like[];

  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

  @Field(() => Boolean, { nullable: true })
  isCtxUserIdAFollowerOfPostUser: boolean;

  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => Date, { nullable: true })
  created_at: Date;

  @Field(() => Date, { nullable: true })
  updated_at?: Date;

  @Field(() => Int, { nullable: false })
  comments_count: number;

  @Field(() => Int, { nullable: false })
  likes_count: number;

  @Field(() => Boolean, { nullable: false })
  currently_liked: boolean;
}

@ObjectType()
export class HandlePostPayload {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String)
  action: string;

  @Field(() => ID, { nullable: true })
  id: string;

  @Field(() => Boolean, { nullable: true })
  title: string;

  @Field(() => [Image], { nullable: true })
  images: Image[];

  @Field(() => Boolean, { nullable: true })
  isCtxUserIdAFollowerOfPostUser?: boolean;

  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => Date, { nullable: true })
  created_at: Date;

  @Field(() => Date, { nullable: true })
  updated_at?: Date;

  @Field(() => Int, { nullable: true })
  comment_count?: number;

  @Field(() => Int, { nullable: false })
  likes_count: number;

  @Field(() => Boolean, { nullable: false })
  currently_liked: boolean;
}
