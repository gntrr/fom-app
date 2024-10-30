import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Box,
  useToast,
  Spinner,
  Avatar,
  Image,
  Text,
} from '@chakra-ui/react';
import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from '../utils/alerts';
import Cookies from 'js-cookie';

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CDN_USER_PRESET // Replace with your Cloudinary upload preset
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CDN_NAME // Replace with your Cloudinary cloud name

const UpdateProfileForm = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
    profileImage: user.profileImage,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user.profileImage || null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const toast = useToast();
  const token = Cookies.get('token');

  const handleImageUpload = async () => {
    setImageUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', imageFile as File);
    uploadData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: uploadData,
    });

    const data = await res.json();
    setImageUploading(false);

    if (data.secure_url) {
      return data.secure_url;
    } else {
      showErrorAlert('Error uploading image', 'Failed to upload the image.');
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = formData.profileImage;
    if (imageFile) {
      imageUrl = await handleImageUpload();
    }

    const response = await fetch('/api/user/updateProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...formData, profileImage: imageUrl }),
    });

    setLoading(false);

    if (response.ok) {
      const updatedUser = await response.json();
      onUpdate(updatedUser);
      showSuccessAlert('Profile Updated', 'Your profile has been updated successfully.');
    } else {
      showErrorAlert('Failed to update profile', 'An error occurred while updating your profile.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <Box as="form" onSubmit={handleSubmit} maxW="400px" w="full">
      <VStack spacing={4} align="stretch">
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </FormControl>

        <FormControl id="password">
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </FormControl>

        <FormControl id="profileImage">
          <FormLabel>Profile Image</FormLabel>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <Image
              src={imagePreview}
              alt="Image Preview"
              boxSize="100px"
              objectFit="cover"
              borderRadius="full"
              mt={2}
            />
          )}
          {imageUploading && <Spinner size="sm" />}
        </FormControl>

        <Button type="submit" colorScheme="blue" isLoading={loading} mt={4}>
          Update Profile
        </Button>
      </VStack>
    </Box>
  );
};

export default UpdateProfileForm;
