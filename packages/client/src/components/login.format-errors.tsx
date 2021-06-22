import { Box, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { ReactElement } from "react";

import { toErrorMap } from "../lib/utilities.toErrorMap";

type FormatErrorType = {
  setErrors: (errors: any) => void;
  setUserConfirmedHelper: (comp: ReactElement) => void;
  errors: any[];
};

export function formatErrors({
  errors,
  setErrors,
  setUserConfirmedHelper,
}: FormatErrorType): void {
  const errorMap = toErrorMap(errors);
  //
  if ("user_confirmed" in errorMap) {
    setUserConfirmedHelper(
      <Box>
        <Text color="crimson">{errorMap.user_confirmed}</Text>
        <Box>
          <NextLink href="/re-confirmation" passHref>
            <Link>send another confirmation email</Link>
          </NextLink>
        </Box>
      </Box>
    );

    // delete the user_confirmed error
    // and set any other errors
    delete errorMap.user_confirmed;
    setErrors(errorMap);

    // if there are other validation errors that are NOT
    // confirmation errors map and set them
  } else if (errorMap) {
    setErrors(errorMap);
  } else {
    // if there are FieldErrors, map and set them
    // @TODO: Revisit this, looks wrong
    setErrors(errorMap);
  }
}
