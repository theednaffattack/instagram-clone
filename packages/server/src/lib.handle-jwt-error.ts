import { ApolloError } from "apollo-server-express";
import { logger } from "./lib.logger";

/**
 *
 */
export interface SpecialFormatter {
  /** Specified to key to search for. Intended for custom error throwing using the 'errorToThrow' property. */
  errorMessageToSearch: string;
  /** Valid error or string to throw. */
  errorToThrow: ApolloError | Error | string;
}

/**
 *
 * @param error The error thrown in 'catch'
 */
export function handleJwtError(error: unknown): void {
  logger.error({ error, name: error instanceof Error ? error.name : "No name" });
  const knownJwtErrorNames = ["TokenExpiredError"];
  const knownJwtErrorMessages = ["jwt expired"];
  // Work on just handling expired errors, for now
  if (error instanceof Error) {
    throw error;
  }
  // We want to pass the error on here
  // because we'd unknown errors to be show-stopping
  // until they can somehow be mitigated
  // (with failovers, I guess???).
  if (error instanceof Error) {
    throw error;
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
