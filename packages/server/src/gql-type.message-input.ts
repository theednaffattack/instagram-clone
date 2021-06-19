import { ArgsType, Field, ID } from "type-graphql";
import { Upload } from "./gql-type.upload";

@ArgsType()
export class AddMessageToThreadInput {
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
