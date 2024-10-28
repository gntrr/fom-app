import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Heading,
  VStack,
  Text,
  Center,
  useToast,
} from '@chakra-ui/react';
import { PasswordInput} from '@chakra-ui/react';
import { showErrorAlert } from '../utils/alerts';

const Login = () => {
  const router = useRouter();
  const toast = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/'); // Redirect to dashboard if already logged in
    }
  }, [router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    // Send request to the API to check for authentication
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token); // Store JWT in localStorage
      router.push('/');
    } else {
      showErrorAlert('Login Failed', 'Invalid credentials, please try again.');
    }
    setLoading(false);
  };

  return (
    <Center minHeight="100vh" bg="gray.50" p={4}>
      <Box
        maxW="sm"
        w="full"
        p={8}
        bg="white"
        boxShadow="lg"
        borderRadius="md"
        textAlign="center"
      >
        {/* Logo or Heading */}
        <Heading as="h1" size="lg" mb={4} color="blue.600">
          FOM-App
        </Heading>
        <Text fontSize="md" color="gray.600" mb={6}>
          Sign in to manage your orders
        </Text>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl id="email" isRequired>
              <FormLabel fontSize="sm" color="gray.700">
                Email
              </FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel fontSize="sm" color="gray.700">
                Password
              </FormLabel>
              <PasswordInput
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="md"
              isLoading={loading}
              width="full"
              mt={4}
            >
              Login
            </Button>
          </VStack>
        </form>

        {/* Additional Links or Text */}
        <Text fontSize="sm" color="gray.500" mt={4}>
          Forgot your password? Sorry, we don't have that feature yet.
        </Text>
      </Box>
    </Center>
  );
};

export default Login;
