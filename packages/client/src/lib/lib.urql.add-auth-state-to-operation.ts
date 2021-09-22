import type { Operation } from "@urql/core";
import { makeOperation } from "@urql/core";
import { logger } from "./lib.logger";
import type { AuthExchangeArgs } from "./types";

export function addAuthToOperation({
  authState,
  operation,
}: AuthExchangeArgs): Operation<any, any> {
  // logger.info("INSIDE ADD AUTH TO OPERATION");
  // logger.info({ authState });
  logger.info({});
  if (!authState || !authState.authState?.accessToken) {
    return operation;
  }

  const fetchOptions =
    typeof operation.context.fetchOptions === "function"
      ? operation.context.fetchOptions()
      : operation.context.fetchOptions || {};

  return makeOperation(operation.kind, operation, {
    ...operation.context,
    fetchOptions: {
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        Authorization: "Bearer " + authState.authState.accessToken,
      },
    },
  });
}
