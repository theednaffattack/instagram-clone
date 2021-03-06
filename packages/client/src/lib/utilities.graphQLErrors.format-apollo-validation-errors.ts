import { GraphQLError } from "graphql/error";

import { FieldError } from "../generated/graphql";

export function formatValidationErrors(
  errors: ReadonlyArray<GraphQLError>
): FieldError[] {
  if (!errors) {
    return [
      {
        field: "any",
        message: "Cannot locate errors to format.",
      },
    ];
  }

  // First we filter for any "Argument Validation Error" messages
  // we can find. These were set by type-graphql
  const filteredValidationErrors = errors
    .filter(({ message }) => message === "Argument Validation Error")
    .map(({ message, path }) => {
      return {
        field: path ? (path[0] as string) : "nope no field",
        message,
      };
    });

  return filteredValidationErrors;
}
