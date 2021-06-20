import { Flex } from "@chakra-ui/core";
import { CSSProperties } from "react";

type WrapperProps = {
  children: React.ReactChildren | React.ReactChild;
  flexDirection?: CSSProperties["flexDirection"];
};

export function Wrapper({ children, flexDirection = "row" }: WrapperProps) {
  return (
    <Flex flexDirection={flexDirection} maxW="400px" mx="auto" mt={8} w="100%">
      {children}
    </Flex>
  );
}
