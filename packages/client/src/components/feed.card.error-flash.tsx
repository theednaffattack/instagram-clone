import {
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { ErrorFlashReducerAction } from "./feed.public-card";

interface ErrorFlashProps {
  dispatchErrorFlash: React.Dispatch<ErrorFlashReducerAction>;
  errorMessage: string | React.ReactElement;
}

export function ErrorFlash({
  errorMessage,
  dispatchErrorFlash,
}: ErrorFlashProps): JSX.Element {
  const closeButtonFocusRef = useRef<HTMLButtonElement>();

  useEffect(() => {
    closeButtonFocusRef.current.focus();
  }, []);
  return (
    <Alert
      flexDirection="column"
      justifyContent="center"
      textAlign="center"
      status="error"
      // maxWidth="300px"
    >
      <Flex>
        <AlertIcon />
        <AlertTitle mr={2}>{errorMessage}</AlertTitle>
      </Flex>
      {/* <AlertDescription>{flash}</AlertDescription> */}
      <CloseButton
        position="absolute"
        right="8px"
        top="8px"
        disabled={!errorMessage}
        onClick={(event) => {
          event.preventDefault();
          dispatchErrorFlash({ type: "dismissed-comment" });
        }}
        tabIndex={0}
        type="button"
        ref={closeButtonFocusRef}
      />
    </Alert>
  );
}
