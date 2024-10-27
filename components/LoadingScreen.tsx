import { Box, Spinner, Text } from '@chakra-ui/react';

const LoadingScreen = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"      // Full viewport height
      width="100vw"       // Full viewport width
      bg="white"          // Background color
      textAlign="center"
    >
      <Spinner size="xl" color="blue.500" mb="4" />
      <Text fontSize="lg" color="gray.500">Wait a moment...</Text>
    </Box>
  );
};

export default LoadingScreen;
