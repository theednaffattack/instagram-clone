import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from "@chakra-ui/react";
import React, { useState } from "react";

export default function AccessDenied({
  message,
}: {
  message?: string;
}): JSX.Element {
  const [alertVisibility, setAlertVisibility] =
    useState<"isVisible" | "isHidden">("isVisible");
  const defaultMessage = "You must be authenticated.";

  if (alertVisibility === "isVisible") {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Access Denied!</AlertTitle>
        <AlertDescription>
          {message ? message : defaultMessage}
        </AlertDescription>
        <CloseButton
          position="absolute"
          right="8px"
          top="8px"
          onClick={(evt) => {
            evt.preventDefault();
            setAlertVisibility("isHidden");
          }}
        />
      </Alert>
    );
  } else {
    return null;
  }
}
