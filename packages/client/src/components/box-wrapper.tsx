import { Box } from "@chakra-ui/react";

type WrapperProps = {
  children: React.ReactChildren | React.ReactChild;
};

export function Wrapper({ children }: WrapperProps): JSX.Element {
  return (
    <Box maxW="400px" mx="auto" mt={8} w="100%" h="100%">
      {children}
    </Box>
  );
}
