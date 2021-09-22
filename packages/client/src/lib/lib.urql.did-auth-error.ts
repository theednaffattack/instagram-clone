import type { CombinedError } from "@urql/core";
import { logger } from "./lib.logger";

export function didAuthError({ error }: { error: CombinedError }): boolean {
  logger.info("DID AUTH ERROR");
  logger.info({ error });
  return error.graphQLErrors.some((err) => {
    return err.extensions?.code === "FORBIDDEN";
  });
}
