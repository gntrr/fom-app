import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, FormControl, FormLabel, Input, Textarea, Select, Heading, Spinner, Image, useToast, Grid, GridItem, Icon, SimpleGrid } from '@chakra-ui/react';
import withAuth from '../../../components/withAuth';
import Layout from '../../../components/Layout';
import Head from 'next/head';
import LoadingScreen from '../../../components/LoadingScreen';
import { LuChevronLeft } from 'react-icons/lu';
import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from '../../../utils/alerts';

const CLOUDINARY_UPLOAD_PRESET = process.env.CDN_SERVICES_PRESET // Replace with your Cloudinary upload preset
const CLOUDINARY_CLOUD_NAME = process.env.CDN_NAME // Replace with your Cloudinary cloud name

const EditService = () => {
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
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchServiceData();
    }
  }, [id]);

  const fetchServiceData = async () => {
    setLoading(true);
    const response = await fetch(`/api/services/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    const data = await response.json();
    setForm(data);
    setImagePreview(data.image);
    setLoading(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return form.image;
    setImageUploading(true);
    const data = new FormData();
    data.append('file', imageFile);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data,
    });
    const result = await res.json();
    setImageUploading(false);
    return result.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = form.image;

    if (imageFile) {
      imageUrl = await handleImageUpload();
    }

    const response = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
      body: JSON.stringify({ ...form, image: imageUrl }),
    });

    if (response.ok) {
        showSuccessAlert('Service updated successfully');
        router.push('/services');
    } else {
        showErrorAlert('Failed to update service');
      }
    };
  
    if (loading) return <LoadingScreen />;
  
    return (
      <>
        <Head>
          <title>Edit Service | FOM-App</title>
          <meta name="description" content="Edit your existing service details." />
        </Head>
        <Layout>
          <Box p="8">
            <Box display="flex" alignItems="center" mb="8">
                <Icon as={LuChevronLeft} fontSize="25px" cursor="pointer" onClick={() => router.push('/services')} />
                <Heading fontSize="2xl" ml="4">Edit Service</Heading>
            </Box>
            <form onSubmit={handleSubmit}>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4} w={{ base: '100%', md: '50%' }} mt="8">
                    <GridItem colSpan={2}>
                        <FormControl mb="4">
                            <FormLabel>Name</FormLabel>
                            <Input name="name" value={form.name} onChange={handleChange} required />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={{ base: 2, lg: 1 }}>
                        <FormControl mb="4">
                            <FormLabel>Image Thumbnail</FormLabel>
                            <Input type="file" accept="image/*" onChange={handleImageChange} />
                            {imagePreview && (
                            <Image src={imagePreview} alt="Image Preview" boxSize="100px" objectFit="cover" borderRadius="md" mt="2" />
                            )}
                            {imageUploading && <Spinner size="sm" mt="2" />}
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={{ base: 2, lg: 1 }}>
                        <FormControl mb="4">
                            <FormLabel>Price (Rp)</FormLabel>
                            <Input type="number" name="price" value={form.price} onChange={handleChange} required />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={2}>
                        <FormControl mb="4">
                            <FormLabel>Description</FormLabel>
                            <Textarea name="description" value={form.description} onChange={handleChange} required />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={{ base: 2, lg: 1 }}>
                        <FormControl mb="4">
                            <FormLabel>Revision</FormLabel>
                            <Input type="number" name="revision" value={form.revision} onChange={handleChange} required />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={{ base: 2, lg: 1 }}>
                        <FormControl mb="4">
                            <FormLabel>Working Days</FormLabel>
                            <Input type="number" name="workingTime" value={form.workingTime} onChange={handleChange} required />
                        </FormControl>
                    </GridItem>
                    <GridItem colSpan={{ base: 2, lg: 1 }}>
                        <FormControl mb="4">
                            <FormLabel>Availability</FormLabel>
                            <Select name="availability" value={form.availability} onChange={handleChange}>
                                <option value="available">Available</option>
                                <option value="not available">Not Available</option>
                            </Select>
                        </FormControl>
                    </GridItem>
                  </SimpleGrid>
                <Button type="submit" colorScheme="blue" mt="6" isLoading={loading}>Update Service</Button>
              </form>
          </Box>
        </Layout>
      </>
    );
  };
  
  export default withAuth(EditService);