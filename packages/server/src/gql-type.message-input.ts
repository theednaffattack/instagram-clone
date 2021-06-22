import { ArgsType, Field, ID, InputType } from "type-graphql";
import { Upload } from "./gql-type.upload";

@ArgsType()
export class AddMessageToThreadArgsInput {
  @Field(() => ID)
  threadId: string;

  @Field(() => String)
  sentTo: string;

  @Field(() => [ID])
  invitees: string[];

  @Field(() => String)
  message: string;

  @Field(() => [String], { nullable: "itemsAndList" })
  images: string[];
}

@InputType()
export class AddMessageToThreadInputType {
  // @ts-ignore
  @Field((type) => ID)
  threadId: string;

  // @ts-ignore
  @Field((type) => String)
  sentTo: string;

  @Field(() => [ID])
  invitees: string[];

  // @ts-ignore
  @Field((type) => String)
  message: string;

  @Field(() => [String], { nullable: "itemsAndList" })
  images: string[];
}

// @ArgsType()
// export class CreateMessageThreadAndMessageInput {
//   @Field(() => String)
//   sentTo: string;

//   @Field(() => [ID])
//   invitees: string[];

//   @Field(() => String)
//   message: string;

//   @Field(() => [GraphQLUpload], { nullable: "itemsAndList" })
//   images?: Upload[];
// }

// @InputType()
// export class AddMessageToThreadInput_v2 {
//   @Field(() => ID)
//   threadId: string;

//   @Field(() => String)
//   sentTo: string;

//   @Field(() => [ID])
//   invitees: string[];

//   @Field(() => String)
//   message: string;

//   @Field(() => [String], { nullable: "itemsAndList" })
//   images: string[];
// }
