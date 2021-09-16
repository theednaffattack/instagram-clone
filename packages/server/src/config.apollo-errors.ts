import { ApolloError } from "apollo-server-errors";
import { ClassType } from "type-graphql";

export const nodeEnvIsUndefined = (functionName: string): string =>
  `The NODE_ENV var is undefined. The "${functionName}" expects to receive NODE_ENV as an argument.  Please set your environment variable "NODE_ENV" to "development", "production" or "test" and try again.`;

// Adapted from: https://github.com/apollographql/apollo-server/issues/2917#issuecomment-516405110
export class DatabaseInteractionError extends ApolloError {
  constructor(message: string) {
    const extensions = {
      type: "api_error",
      name: "DatabaseInteractionError",
    };
    super(message, "VALIDATION_ERROR", extensions);
  }
}

// export function errorSavingInfoToDatabase({ functionName, error }: { functionName: string; error: any }) {
//   return createError(CustomErrorType.DatabaseError, {
//     message: "",
//     options: { showLocations: true, showPath: true },
//   });
// }

// export const AuthorizationError = createError("AuthorizationError", {
//   message: "You are not authorized.",
// });

interface CreateAuthorizationErrorProps {
  message?: string | undefined;
}

class CustomAuthorizationError extends ApolloError {
  constructor(message: string) {
    const extensions = {
      type: "api_error",
      name: "AuthorizationError",
    };
    super(message, "AUTHORIZATION_ERROR", extensions);
  }
}
class CustomAuthenticationError extends ApolloError {
  constructor(message: string) {
    const extensions = {
      type: "api_error",
      name: "AuthenticationError",
    };
    super(message, "AUTHENTICATION_ERROR", extensions);
  }
}

export function createAuthorizationError({
  message = "You are not authorized",
}: CreateAuthorizationErrorProps): CustomAuthorizationError {
  return new CustomAuthorizationError(message);
}

export function createAuthenticationError({
  message = "Not Authenticated",
}: CreateAuthorizationErrorProps): CustomAuthenticationError {
  return new CustomAuthenticationError(message);
}

export const JwtExpirationError = new ApolloError("Your session has expired, please log in.", "AUTHORIZATION_ERROR", {
  message: "token is expired",
});

export const JwtMalformedError = new ApolloError(
  "Your session token is incorrectly formatted. Please try again.",
  "AUTHORIZATION_ERROR",
  { message: "token is malformed" }
);

interface ErrorOptions {
  message: string;
  errorCode: string;
  extensions: Record<string, string>;
  errorName?: string;
}

interface ClassMaker {
  Class: ClassType;
  ClassName: string;
}
