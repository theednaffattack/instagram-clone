import { ApolloError } from "apollo-server-express";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { ArgumentValidationError } from "type-graphql";
import { logger } from "./lib.logger";

// custom error handling from:
// https://github.com/19majkel94/type-graphql/issues/258

export function formatGraphQLErrors(error: GraphQLError): GraphQLFormattedError {
  const { extensions = {}, locations, message, path } = error;

  if (message.includes("Not authenticated")) {
    return error;
  }

  if (message.includes("session has expired")) {
    console.error(error);

    return error;
  }

  if (error.originalError instanceof ApolloError) {
    return error;
  }

  if (error.originalError instanceof ArgumentValidationError) {
    // Add a custom error code
    extensions.code = "GRAPHQL_VALIDATION_FAILED";
    // Strip off the validation erros created by
    // decorator-style field validators.
    const { validationErrors } = extensions.exception;
    const valErrorsCache = [];

    // Make sure that validationErrors is iterable.
    if (validationErrors.length) {
      // Loop over the validation errors and
      // create a custom error shape that's easier to
      // digest later.
      for (const error of validationErrors) {
        valErrorsCache.push({
          field: error.property,
          message: Object.values(error.constraints)[0],
        });
      }
    }

    // If validationError is of an unexpected shape, panic.
    if (validationErrors && !validationErrors.length) {
      console.error("CHECK SHAPE OF VALIDATION ERRORS - IN FORMAT APOLLO ERRORS");
      console.error(validationErrors);
      valErrorsCache.push({
        field: "username",
        message: validationErrors.message,
      });
    }

    // Add the new error shape to extensions.
    extensions.valErrors = valErrorsCache;

    return {
      extensions,
      locations,
      message,
      path,
    };
  }

  //   error.message = "Internal Server Error";
  logger.info({ extensions, locations, message, path }, "FORMAT APOLLO ERRORS - SERVER SIDE");

  const getStacktrace = extensions.exception ? extensions.exception.stacktrace[0].replace("Error: ", "") : message;

  return {
    message: getStacktrace,
    path,
    locations,
    // extensions
  };
}
