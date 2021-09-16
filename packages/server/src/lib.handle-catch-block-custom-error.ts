import { ApolloError } from "apollo-server-core";
import { logger } from "./lib.logger";

export function handleCatchBlockCustomError(error: unknown, errorObj: Error | ApolloError, message?: string): void {
  logger.error({ error, name: error instanceof Error ? error.name : "No name" });

  if (error instanceof Error || error instanceof ApolloError) {
    throw errorObj;
  }
  // If it's an old (bad) JS code with
  // error strings, throw it in a new Error.
  if (typeof error === "string") {
    throw new Error(error);
  }
  // Any errors of unexpected shape
  // get stringified and thrown as new
  // Errors.
  throw new Error(JSON.stringify(error));
}
