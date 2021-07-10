import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { HelloInput } from "./gql-type.hello-input";
import { MyContext } from "./typings";

@Resolver()
export class HelloWithUserInput {
  @Mutation(() => String, { nullable: true })
  async helloWithUserInput(
    @Arg("data")
    { userInput }: HelloInput,
    @Ctx() ctx: MyContext
  ): Promise<string> {
    return userInput;
  }
}
