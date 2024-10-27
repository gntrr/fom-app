import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, FormControl, FormLabel, Input, Textarea, Select, Heading, Icon, Grid, GridItem, Spinner, Image, useToast } from '@chakra-ui/react';
import withAuth from '../../components/withAuth';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { LuChevronLeft } from "react-icons/lu";
import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from '../../utils/alerts';

const CLOUDINARY_UPLOAD_PRESET = process.env.CDN_SERVICES_PRESET // Replace with your Cloudinary upload preset
const CLOUDINARY_CLOUD_NAME = process.env.CDN_NAME // Replace with your Cloudinary cloud name

const AddService = () => {
  const [form, setForm] = useState({
    name: '',
    image: '',
    price: 0,
    description: '',
    revision: 1,
    workingTime: 1,
    availability: 'available',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return '';
    setImageUploading(true);
    const data = new FormData();
    data.append('file', imageFile);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      setImageUploading(false);
      return result.secure_url;
    } catch (error) {
      setImageUploading(false);
      showErrorAlert('Error uploading image', 'Failed to upload the image.');
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = form.image;

    // Upload image if a file was selected
    if (imageFile) {
      imageUrl = await handleImageUpload();
      if (!imageUrl) return; // Stop if image upload failed
    }

    const response = await fetch('/api/services', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
      body: JSON.stringify({ ...form, image: imageUrl }),
    });

    if (response.ok) {
        showSuccessAlert('Service Added', 'Service has been added successfully.');
        router.push('/services');
    } else {
        showErrorAlert('Failed to add service', 'An error occurred while adding the service.');
    }
  };

  return (
    <>
      <Head>
        <title>Add New Service | FOM-App</title>
        <meta name="description" content="Add a new service to your list of services." />
      </Head>
      <Layout>
        <Box p="8">
          <Box display="flex" alignItems="center" mb="8">
            <Icon as={LuChevronLeft} fontSize="25px" cursor="pointer" onClick={() => router.push('/services')} />
            <Heading fontSize="2xl" ml="4">Add New Service</Heading>
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {/* Name */}
              <GridItem colSpan={2}>
                <FormControl mb="4">
                  <FormLabel>Name</FormLabel>
                  <Input name="name" onChange={handleChange} required />
                </FormControl>
              </GridItem>

              {/* Image Upload */}
              <GridItem>
                <FormControl mb="4">
                  <FormLabel>Thumbnail Image</FormLabel>
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                  {imagePreview && (
                    <Image src={imagePreview} alt="Image Preview" boxSize="100px" objectFit="cover" borderRadius="md" mt="2" />
                  )}
                  {imageUploading && <Spinner size="sm" mt="2" />}
                </FormControl>
              </GridItem>

              {/* Price */}
              <GridItem>
                <FormControl mb="4">
                  <FormLabel>Price (Rp)</FormLabel>
                  <Input type="number" name="price" onChange={handleChange} required />
                </FormControl>
              </GridItem>

              {/* Description */}
              <GridItem colSpan={2}>
                <FormControl mb="4">
                  <FormLabel>Description</FormLabel>
                  <Textarea name="description" onChange={handleChange} required />
                </FormControl>
              </GridItem>

              {/* Revision */}
              <GridItem>
                <FormControl mb="4">
                  <FormLabel>Revision</FormLabel>
                  <Input type="number" name="revision" onChange={handleChange} required />
                </FormControl>
              </GridItem>

              {/* Working Time */}
              <GridItem>
                <FormControl mb="4">
                  <FormLabel>Working Days</FormLabel>
                  <Input type="number" name="workingTime" onChange={handleChange} required />
                </FormControl>
              </GridItem>

              {/* Availability */}
              <GridItem>
                <FormControl mb="4">
                  <FormLabel>Availability</FormLabel>
                  <Select name="availability" onChange={handleChange}>
                    <option value="available">Available</option>
                    <option value="not available">Not Available</option>
                  </Select>
                </FormControl>
              </GridItem>
            </Grid>

            <Button type="submit" colorScheme="blue" mt="6" width={{ base: "full", md: "200px" }}>Add Service</Button>
          </form>
        </Box>
      </Layout>
    </>
  );
};

export default withAuth(AddService);
