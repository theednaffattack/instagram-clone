import { Ctx, Query, Resolver } from "type-graphql";
import { MyContext } from "./typings";

@Resolver()
export class HelloWorldResolver {
  @Query(() => String, { name: "helloWorld", nullable: false })
  async hello(@Ctx() ctx: MyContext): Promise<string> {
    return `Hello World`;
  }
}
