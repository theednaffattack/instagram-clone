import { FieldError } from "../generated/graphql";

export type ErrorMapProps = Record<string, string>;

export function toErrorMap(errors: FieldError[]): ErrorMapProps {
  const errorMap: ErrorMapProps = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });

  return errorMap;
}
