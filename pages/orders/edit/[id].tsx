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
  VStack,
  useToast,
} from '@chakra-ui/react';
import withAuth from '../../../components/withAuth';
import Layout from '../../../components/Layout';
import Head from 'next/head';
import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from '../../../utils/alerts';

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
  });
  const [services, setServices] = useState([]);
  const [manualPrice, setManualPrice] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();

  useEffect(() => {
    if (id) {
      fetchOrderData();
      fetchServices();
    }
  }, [id]);

  const fetchOrderData = async () => {
    const response = await fetch(`/api/orders/${id}`, 
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
    );
    const data = await response.json();
    setForm(data);
  };

  const fetchServices = async () => {
    const response = await fetch('/api/services', 
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
    );
    const data = await response.json();
    setServices(data);
  };

  const handleServiceChange = (e) => {
    const selectedService = services.find(service => service._id === e.target.value);
    setForm({
      ...form,
      services: e.target.value,
      price: manualPrice ? form.price : selectedService?.price || 0
    });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: 
        { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
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
          <Heading fontSize="2xl" mb="8">Edit Order</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Transaction Number</FormLabel>
                <Input name="transactionNumber" value={form.transactionNumber} onChange={handleChange} required />
              </FormControl>  
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input name="name" value={form.name} onChange={handleChange} required />
              </FormControl>
              <FormControl>
                <FormLabel>WhatsApp Number</FormLabel>
                <Input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} required />
              </FormControl>
              <FormControl>
                <FormLabel>Service</FormLabel>
                <Select name="services" value={form.services} onChange={handleServiceChange}>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Brief</FormLabel>
                <Textarea name="brief" value={form.brief} onChange={handleChange} required />
              </FormControl>
              <FormControl>
                <FormLabel>Deadline</FormLabel>
                <Input type="date" name="deadline" value={form.deadline.split('T')[0]} onChange={handleChange} required />
              </FormControl>
              <FormControl>
                <FormLabel>Price</FormLabel>
                <Checkbox isChecked={manualPrice} onChange={(e) => setManualPrice(e.target.checked)}>
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
              <FormControl>
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
              <Button type="submit" colorScheme="blue" width="full">
                Update Order
              </Button>
            </VStack>
          </form>
        </Box>
      </Layout>
    </>
  );
};

export default withAuth(EditOrder);
