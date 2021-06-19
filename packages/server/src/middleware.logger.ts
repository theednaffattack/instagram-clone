import { MiddlewareFn, NextFn, ResolverData } from "type-graphql";
import pino from "pino";

import { MyContext } from "./typings";

const loggerTransport = pino({
  prettyPrint: true,
});

export const Logger: MiddlewareFn<MyContext> = async ({ args, info }, next: NextFn) => {
  const start = Date.now();
  await next();
  const resolveTime = Date.now() - start;

  console.log("logging");

  loggerTransport.info({
    type: "timing",
    name: `${info.parentType.name}.${info.fieldName}`,
    ms: `${resolveTime} ms`,
  });
};
