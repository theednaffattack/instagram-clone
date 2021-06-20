import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input
} from "@chakra-ui/core";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";
import { Thumb } from "./thumb";

type InputFileUploadFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  isRequired?: boolean;
  label?: string;
  name: string;
  placeholder?: string;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
};

export const InputFileUploadField: React.FC<InputFileUploadFieldProps> = ({
  isRequired = false,
  label,
  name,
  placeholder,
  setFieldValue,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField({ name });
  return (
    <FormControl isRequired={isRequired} isInvalid={!!error}>
      {props.type === "hidden" || label === "" ? null : (
        <FormLabel htmlFor={field.name}>{label}</FormLabel>
      )}
      <Input
        variant="unstyled"
        {...field}
        {...props}
        id={field.name}
        placeholder={placeholder}
        onChange={(event) => {
          setFieldValue(name, event.currentTarget.files?.[0]);
        }}
      />

      {field.value && field.value.length > 0 ? (
        <Thumb file={field.value} />
      ) : (
        ""
      )}
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};
