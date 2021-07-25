import {
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Flex,
} from "@chakra-ui/react";
import React, { PropsWithChildren, ReactNode, useState } from "react";

interface LoginErrorProps {
  children: ReactNode;
}

export function LoginErrorMessage({
  children,
}: PropsWithChildren<LoginErrorProps>): JSX.Element {
  const [errorVisibility, setErrorVisibility] =
    useState<"visible" | "hidden">("visible");

  // Hide if dismissed
  if (errorVisibility === "hidden") {
    return null;
  }

  if (typeof children === "string") {
    return (
      <Alert
        flexDirection="column"
        justifyContent="center"
        textAlign="center"
        status="error"
      >
        <Flex bg="pink">
          <AlertIcon />
          <AlertTitle mr={2}>{children}</AlertTitle>
        </Flex>
        {/* <AlertDescription>{flash}</AlertDescription> */}
        <CloseButton
          position="absolute"
          right="8px"
          top="8px"
          disabled={false}
          onClick={(event) => {
            event.preventDefault();
            setErrorVisibility("hidden");
          }}
        />
      </Alert>
    );
  }

  if (Array.isArray(children)) {
    const errorCache = [];
    for (const error of children) {
      errorCache.push(
        <Alert
          flexDirection="column"
          justifyContent="center"
          textAlign="center"
          status="error"
        >
          <Flex bg="pink">
            <AlertIcon />
            <AlertTitle mr={2}>{error}</AlertTitle>
          </Flex>
          {/* <AlertDescription>{flash}</AlertDescription> */}
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            disabled={false}
            onClick={(event) => {
              event.preventDefault();
              setErrorVisibility("hidden");
            }}
          />
        </Alert>
      );
    }
    return <>{errorCache}</>;
  }
}
