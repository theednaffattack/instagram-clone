import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea as ChakraTextarea
} from "@chakra-ui/core";
import { useField } from "formik";
import React, { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  isRequired?: boolean;
  label?: string;
  name: string;
  placeholder?: string;
};

export const TextArea: React.FC<TextAreaProps> = ({
  isRequired = false,
  label,
  name,
  placeholder,

  ...props
}) => {
  const [field, { error }] = useField({ name });
  return (
    <FormControl isRequired={isRequired} isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <ChakraTextarea
        {...field}
        {...props}
        id={field.name}
        placeholder={placeholder}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};
