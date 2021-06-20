import { FetchResult } from "@apollo/client";

import { FieldError } from "../generated/graphql";

export function formatValidationErrors<ApolloQueryType>(
  errors: FetchResult<
    ApolloQueryType,
    Record<string, any>,
    Record<string, any>
  >["errors"]
): FieldError[] {
  if (!errors) {
    return [
      {
        field: "any",
        message: "Cannot locate errors to format."
      }
    ];
  }
  console.log("FORMAT RUNNING", errors);

  // First we filter for any "Argument Validation Error" messages
  // we can find. These were set by type-graphql
  const filteredValidationErrors = errors
    .filter(({ message }) => message === "Argument Validation Error")
    .map(({ extensions, message, path, name }) => {
      console.log("EXTENSIONS", { extensions, name });

      return {
        field: path ? (path[0] as string) : "nope no field",
        message
      };
    });

  console.log(" RESPONSE ERRORS - VIEW STRUCTUre", {
    filteredValidationErrors,
    responseError: errors
  });

  return filteredValidationErrors;
  // }
}
