import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input
} from "@chakra-ui/core";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  isRequired?: boolean;
  label?: string;
  name: string;
  placeholder?: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  isRequired = false,
  label,
  name,
  placeholder,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField({ name });
  return (
    <FormControl isRequired={isRequired} isInvalid={!!error}>
      {props.type === "hidden" || label === "" ? null : (
        <FormLabel htmlFor={field.name}>{label}</FormLabel>
      )}
      <Input {...field} {...props} id={field.name} placeholder={placeholder} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};
