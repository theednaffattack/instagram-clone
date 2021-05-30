import { Resolver, Query, UseMiddleware, Ctx } from "type-graphql";

import { Logger } from "./middleware.logger";
import { MyContext } from "./types";

@Resolver()
export class HelloWorldResolver {
  @Query(() => String, { name: "helloWorld", nullable: false })
  // @UseMiddleware(Logger)
  async hello(@Ctx() ctx: MyContext): Promise<string> {
    return "Hello World";
  }
}
