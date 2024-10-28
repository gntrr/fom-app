import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Spinner,
} from '@chakra-ui/react';

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CDN_USER_PRESET // Replace with your Cloudinary upload preset
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CDN_NAME // Replace with your Cloudinary cloud name

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profileImage: '', // URL of the uploaded profile image
  });
  const [imageUploading, setImageUploading] = useState(false);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET); // Cloudinary preset
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME); // Cloudinary cloud name

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, profileImage: data.secure_url }));
        toast({
          title: 'Image uploaded successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Image upload failed',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error uploading image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Registration Failed',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        {/* Name Input */}
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </FormControl>

        {/* Email Input */}
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </FormControl>

        {/* Password Input */}
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </FormControl>

        {/* Profile Image Upload */}
        <FormControl id="profileImage">
          <FormLabel>Profile Image</FormLabel>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {imageUploading && <Spinner size="sm" mt={2} />}
        </FormControl>

        {/* Submit Button */}
        <Button
          type="submit"
          colorScheme="blue"
          size="md"
          width="full"
          isLoading={loading}
          mt={4}
        >
          Register
        </Button>
      </VStack>
    </form>
  );
};

export default RegisterForm;
