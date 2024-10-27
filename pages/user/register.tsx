import React from 'react';
import { Box, Center, Heading, Text } from '@chakra-ui/react';
import RegisterForm from '../../components/RegisterForm';

const RegisterPage = () => {
  return (
    <Center minHeight="100vh" bg="gray.50" p={4}>
      <Box
        maxW="md"
        w="full"
        p={8}
        bg="white"
        boxShadow="lg"
        borderRadius="md"
        textAlign="center"
      >
        <Heading as="h1" size="lg" mb={4} color="blue.600">
          Create Your Account
        </Heading>
        <Text fontSize="md" color="gray.600" mb={6}>
          Register to access the FOM-App
        </Text>
        <RegisterForm />
      </Box>
    </Center>
  );
};

export default RegisterPage;
