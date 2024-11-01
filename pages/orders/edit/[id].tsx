import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Heading,
  Checkbox,
  SimpleGrid,
  GridItem,
  useToast,
  FormHelperText,
  Spinner,
  Text,
  Icon
} from '@chakra-ui/react';
import withAuth from '../../../components/withAuth';
import Layout from '../../../components/Layout';
import Head from 'next/head';
import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from '../../../utils/alerts';
import { LuChevronLeft } from 'react-icons/lu';
import Cookies from 'js-cookie';

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CDN_BRIEF_PRESET; // Replace with your Cloudinary upload preset
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CDN_NAME; // Replace with your Cloudinary cloud name

const EditOrder = () => {
  const [form, setForm] = useState({
    transactionNumber: '',
    name: '',
    whatsappNumber: '',
    services: '',
    brief: '',
    deadline: '',
    price: 0,
    status: 'in queue',
    uploadedFile: ''
  });
  const [services, setServices] = useState([]);
  const [manualPrice, setManualPrice] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;
  const token = Cookies.get('token');

  useEffect(() => {
    if (id) {
      fetchOrder();
      fetchServices();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        // Format the deadline to "yyyy-MM-dd" format
        data.deadline = data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : '';
        setForm(data);
        setFileName(data.uploadedFile ? 'Uploaded file' : '');
      } else {
        showErrorAlert('Failed to fetch order', data.message || 'An error occurred');
      }
    } catch (error) {
      showErrorAlert('Failed to fetch order', error.message);
    }
  };  

  const fetchServices = async () => {
    const response = await fetch('/api/services', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setServices(data);
  };

  const handleServiceChange = (e) => {
    const selectedService = services.find(service => service._id === e.target.value);
    setForm({
      ...form,
      services: e.target.value,
      price: selectedService?.price || 0
    });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    uploadFileToCloudinary(file);
  };

  const uploadFileToCloudinary = async (file) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      showErrorAlert('Invalid File Type', 'Please upload a valid image or document file.');
      return;
    }

    setFileUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload/`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.secure_url) {
        setForm({ ...form, uploadedFile: data.secure_url });
        showSuccessAlert('File Uploaded', 'The file has been uploaded successfully.');
      } else {
        throw new Error(data.error?.message || 'Unknown error');
      }
    } catch (error) {
      showErrorAlert('File Upload Failed', `An error occurred while uploading the file: ${error.message}`);
    } finally {
      setFileUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      showSuccessAlert('Order Updated!', 'The order has been updated successfully.');
      router.push('/orders');
    } else {
      showErrorAlert('Failed to update order', 'An error occurred while updating the order.');
    }
  };

  return (
    <>
      <Head>
        <title>Edit Order | FOM-App</title>
        <meta name="description" content="Edit an existing order." />
      </Head>
      <Layout>
        <Box p="8">
          <Box display="flex" alignItems="center" mb="8">
            <Icon as={LuChevronLeft} fontSize="25px" cursor="pointer" onClick={() => router.push('/orders')} />
            <Heading fontSize="2xl" ml="4">Edit Order</Heading>
          </Box>
          <form onSubmit={handleSubmit}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4} w={{ base: '100%', md: '50%' }} mt="8">
                <GridItem colSpan={{ base: 2, lg: 1 }}>
                    <FormControl mb="4">
                        <FormLabel>Trx. Number</FormLabel>
                        <Input name="transactionNumber" value={form.transactionNumber} onChange={handleChange} required />
                    </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 2, lg: 1 }}>
                    <FormControl mb="4">
                        <FormLabel>Cust. Name</FormLabel>
                        <Input name="name" value={form.name} onChange={handleChange} required />
                    </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 2, lg: 1 }}>
                    <FormControl mb="4">
                        <FormLabel>WhatsApp Number</FormLabel>
                        <Input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} required />
                        <FormHelperText>Include country code, e.g. +6281234567890</FormHelperText>
                    </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 2, lg: 1 }}>
                    <FormControl mb="4">
                        <FormLabel>Service</FormLabel>
                        <Select name="services" value={form.services} onChange={handleServiceChange}>
                          {services.map((service) => (
                            <option key={service._id} value={service._id}>
                              {service.name}
                            </option>
                          ))}
                        </Select>
                    </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 2, lg: 1 }}>
                    <FormControl mb="4">
                        <FormLabel>Brief</FormLabel>
                        <Textarea name="brief" value={form.brief} onChange={handleChange} required />
                    </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 2, lg: 1 }}>
                    <FormControl mb="4">
                        <FormLabel>Upload Document (optional)</FormLabel>
                        <Input type="file" name='uploadedFile' onChange={handleFileChange} />
                        {fileUploading ? (
                        <Spinner size="sm" mt="2" />
                        ) : (
                        fileName && <Text mt="2" fontSize="sm" color="gray.500">Selected File: {fileName}</Text>
                        )}
                        <FormHelperText>Supported file types: JPG, PNG, PDF, DOC, DOCX</FormHelperText>
                    </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 2, lg: 1 }}>
                    <FormControl mb="4">
                        <FormLabel>Deadline</FormLabel>
                        <Input type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
                    </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 2, lg: 1 }}>
                    <FormControl mb="4">
                        <FormLabel>Price</FormLabel>
                        <Checkbox isChecked={manualPrice} onChange={(e) => setManualPrice(e.target.checked)} mb="2">
                            Enter price manually
                        </Checkbox>
                        <Input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        isReadOnly={!manualPrice}
                        required
                        />
                    </FormControl>
                </GridItem>
                <GridItem colSpan={{ base: 2, lg: 1 }}>
                    <FormControl mb="4">
                        <FormLabel>Status</FormLabel>
                        <Select name="status" value={form.status} onChange={handleChange}>
                          <option value="in queue">In Queue</option>
                          <option value="in progress">In Progress</option>
                          <option value="in review">In Review</option>
                          <option value="revision">Revision</option>
                          <option value="waiting for payment">Waiting for Payment</option>
                          <option value="done">Done</option>
                        </Select>
                    </FormControl>
                </GridItem>                                                    
            </SimpleGrid>
            <Button type="submit" colorScheme="blue" width={{ base: "full", md: "200px" }} mt="6" isDisabled={fileUploading}>
                Update Order
            </Button>
          </form>
        </Box>
      </Layout>
    </>
  );
};

export default withAuth(EditOrder);
