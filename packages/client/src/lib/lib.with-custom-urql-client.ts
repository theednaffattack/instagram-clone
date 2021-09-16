import { withUrqlClient } from "next-urql";
import { customAuthExchange, customErrorExchange } from "./lib.urql.exchanges";
import { cacheExchange, dedupExchange, fetchExchange } from "@urql/core";
import { logger } from "./lib.logger";

export const withCustomUrqlClient = (Component: any) =>
  withUrqlClient(
    (ssrExchange, ctx) => {
      const url = ctx?.req
        ? process.env.NEXT_PUBLIC_DEVELOPMENT_GQL_URI!
        : process.env.NEXT_PUBLIC_PRODUCTION_GQL_URI!;
      logger.info(
        {
          what: ctx ? (ctx?.req ? "server" : "client") : "no ctx",
          again: ctx?.pathname,
          url,
        },
        "[ withUrqlClient ]"
      );
      return {
        exchanges: [
          process.env.NODE_ENV !== "production"
            ? require("@urql/devtools").devtoolsExchange
            : null,
          dedupExchange,
          cacheExchange,
          ssrExchange,
          customErrorExchange(),
          customAuthExchange(ctx),
          fetchExchange,
        ].filter(Boolean),
        requestPolicy: "cache-first",
        url,
      };
    },
    { ssr: true }
  )(Component);
