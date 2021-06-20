import { Box } from "@chakra-ui/core";

type WrapperProps = {
  children: React.ReactChildren | React.ReactChild;
};

export function Wrapper({ children }: WrapperProps) {
  return (
    <Box maxW="400px" mx="auto" mt={8} w="100%" h="100%">
      {children}
    </Box>
  );
}
