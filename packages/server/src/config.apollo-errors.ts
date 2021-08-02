import { ApolloError, createError, ErrorConfig } from "apollo-errors";

enum CustomErrorType {
  AuthorizationError = "AuthorizationError",
  DatabaseError = "DatabaseError",
}

export const nodeEnvIsUndefined = (functionName: string): string =>
  `The NODE_ENV var is undefined. The "${functionName}" expects to receive NODE_ENV as an argument.  Please set your environment variable "NODE_ENV" to "development", "production" or "test" and try again.`;

export function errorSavingInfoToDatabase({ functionName, error }: { functionName: string; error: any }) {
  return createError(CustomErrorType.DatabaseError, {
    message: "",
    options: { showLocations: true, showPath: true },
  });
}

// export const AuthorizationError = createError("AuthorizationError", {
//   message: "You are not authorized.",
// });

interface CreateAuthorizationErrorProps {
  message?: string | undefined;
}
export function createAuthorizationError({ message = "You are not authorized" }: CreateAuthorizationErrorProps) {
  return createError(CustomErrorType.AuthorizationError, { message });
}

export function createAuthenticationError({ message = "Not Authenticated" }: CreateAuthorizationErrorProps) {
  return createError(CustomErrorType.AuthorizationError, { message });
}

// export class MyError extends ApolloError {
//   constructor(message: string) {
//     super(message, "MY_ERROR_CODE", {});

//     Object.defineProperty(this, "name", { value: "MyError" });
//   }
// }

export const JwtExpirationError = new ApolloError(
  "Your session has expired, please log in.",
  { message: "CUSTOM_AUTH_ERROR" },
  { message: "token is expired" }
);

export const JwtMalformedError = new ApolloError(
  "Your session token is incorrectly formatted. Please try again.",
  { message: "CUSTOM_AUTH_ERROR" },
  { message: "token is malformed" }
);
