import type { Operation } from "@urql/core";
import { logger } from "./lib.logger";
import type { AuthState } from "./types";

interface WillAuthError {
  operation: Operation<any, any>;
  authState: AuthState;
}

export function willAuthError({
  operation,
  authState,
}: WillAuthError): boolean {
  logger.info("WILL AUTH ERROR");
  logger.info({ operation, authState });
  if (!authState) {
    // Detect our login mutation and let this operation through:
    if (
      operation.kind === "mutation" &&
      // Here we find any mutation definition with the "login" field
      operation.query.definitions.some((definition) => {
        return (
          definition.kind === "OperationDefinition" &&
          definition.selectionSet.selections.some((node) => {
            // The field name is just an example, since signup may also be an exception
            return node.kind === "Field" && node.name.value === "login";
          })
        );
      })
    ) {
      logger.info("WILL AUTH ERROR - FALSE, NO ERROR - LOGIN");
      // No, this will not error
      return false;
    }

    // If authState is null and we sense ANY operation (besides "login")
    // trigger 'getAuth' in authExchange.
    if (operation.kind) {
      logger.info("NOT LOGIN PAGE BUT SENSING AN OPERATION");
      logger.info("WILL AUTH ERROR - TRUE, THERE IS AN ERROR - CHECK EVERY OP");
      logger.info({ operation });
      return true;
    }

    // eslint-disable-next-line no-constant-condition
    //  JWT is expired
  } else if (
    authState.authState?.expiresIn &&
    new Date(authState.authState.expiresIn) < new Date()
  ) {
    logger.info("WILL AUTH ERROR - TRUE, THERE IS AN ERROR - JWT EXPIRED");
    // Yes, this will error
    return true;
  }

  logger.info(
    "WILL AUTH ERROR - FALSE, NO ERROR - FUNCTION BOTTOM (DEFAULT, I GUESS)"
  );
  // No, this will not error
  return false;
}
