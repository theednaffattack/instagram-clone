import { MiddlewareFn } from "type-graphql";
import { MyContext } from "./typings";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  // if (!context.req.session!.userId && !context.userId) {
  if (!context.userId) {
    console.log("VIEW CONTEXT OBJECT KEYS");
    console.log(Object.keys(context));
    console.log(context.req.session);
    console.log("VIEW USER ID", { userId: context.userId });

    throw new Error("Not authenticated");
  }
  return next();
};
