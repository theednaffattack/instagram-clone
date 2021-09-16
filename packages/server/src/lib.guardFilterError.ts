import { logger } from "./lib.logger";
import { SpecialFormatter } from "./lib.handle-catch-block-error";

/**
 * A guard function that catches specially defined Error messages.
 * @param error type is unknown. Most likely Error | ApolloError | string
 * @param special {@link SpecialFormatter}
 */

export function guardFilterError(error: unknown, special: SpecialFormatter): void {
  logger.info("GUARD FILTER");
  // Special provides a string to search and a custom Error to throw.
  if (error instanceof Error) {
    // Catch special cases here
    if (error.message.includes(special.errorMessageToSearch)) {
      logger.error(special.errorMessageToSearch.toUpperCase());
      // When we find them throw the provided custom error class.
      throw special.errorToThrow;
    }
  }
}
