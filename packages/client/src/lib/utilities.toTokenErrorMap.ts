import { FieldError } from "../generated/graphql";
import { ErrorMapProps } from "./utilities.toErrorMap";

export function toTokenErrorMap(errors: FieldError[]): ErrorMapProps {
  const errorMap: ErrorMapProps = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });

  return errorMap;
}
