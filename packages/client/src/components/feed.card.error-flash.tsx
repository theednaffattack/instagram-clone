import {
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";

type ErrorFlashProps = {
  errorMessage: string;
  setErrorFlashes: React.Dispatch<React.SetStateAction<"hidden" | "visible">>;
};

export function ErrorFlash({
  errorMessage,
  setErrorFlashes,
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
      maxWidth="300px"
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
          setErrorFlashes("hidden");
        }}
        tabIndex={0}
        type="button"
        ref={closeButtonFocusRef}
      />
    </Alert>
  );
}
