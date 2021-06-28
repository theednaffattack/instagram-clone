import { Field, InputType } from "type-graphql";

@InputType()
export class HelloInput {
  @Field()
  userInput: string;
}
