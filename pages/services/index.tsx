// pages/services/index.tsx
import { useState, useEffect } from 'react';
import { Box, Button, Heading, Table, Thead, Tbody, Tr, Th, Td, Stack, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Text, Spinner, Badge } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import withAuth from '../../components/withAuth';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from '../../utils/alerts';
import Cookies from 'js-cookie';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null); // State to hold selected service data
  const [loadingService, setLoadingService] = useState(false); // Loading state for service details
  const router = useRouter();
  const token = Cookies.get('token');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const response = await fetch('/api/services', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    setServices(data);
  };

  const fetchServiceDetail = async (id) => {
    setLoadingService(true);
    const response = await fetch(`/api/services/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    setSelectedService(data);
    setLoadingService(false);
  };

  const handleDelete = async (id) => {
    showConfirmationAlert('Delete This Service?', 'This action cannot be undone, so think twice before deleting.')
      .then((result) => {
        if (result.isConfirmed) {
          fetch(`/api/services/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
          })
            .then((response) => {
              if (response.ok) {
                setServices(services.filter((service) => service._id !== id));
                showSuccessAlert('Deleted!', 'The service has been deleted.');
              } else {
                showErrorAlert('Error', 'Failed to delete the service.');
              }
            })
            .catch(() => {
              showErrorAlert('Error', 'Failed to delete the service.');
            });
        }
  });
};

  return (
    <>
      <Head>
        <title>Services | FOM-App</title>
        <meta name="description" content="Manage your services and their availability." />
      </Head>
      <Layout>
        <Box p="8">
          <Heading fontSize="2xl" fontWeight="bold" mb="4">Services</Heading>
          <Button colorScheme="blue" size="md" mb="6" onClick={() => router.push('/services/add')}>Add New Service</Button>
            <Box w="100%" overflowX="auto" bg="white" shadow={"md"} borderRadius="md" p="4">
              <Table variant="simple" mt="4">
                <Thead>
                  <Tr>
                    <Th>Image</Th>
                    <Th>Name</Th>
                    <Th>Price</Th>
                    <Th>Availability</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {services.map((service) => (
                    <Tr key={service._id}>
                      <Td><img src={service.image} alt={service.name} width="50" /></Td>
                      <Td>
                        <Popover onOpen={() => fetchServiceDetail(service._id)}>
                          <PopoverTrigger>
                            <Button variant="link" colorScheme="blue">{service.name}</Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader fontWeight="bold">{service.name}</PopoverHeader>
                            <PopoverBody>
                              {loadingService ? (
                                <Spinner size="sm" />
                              ) : selectedService ? (
                                <>
                                  <Text>Price: Rp. {selectedService.price.toLocaleString()}</Text>
                                  <Text>Availability: {selectedService.availability}</Text>
                                  <Text>Working Days: {selectedService.workingTime} days</Text>
                                  <Text>Description: {selectedService.description}</Text>
                                  <Text>Revisions: {selectedService.revision}</Text>
                                </>
                              ) : (
                                <Text>No details available</Text>
                              )}
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Td>
                      <Td>Rp. {service.price.toLocaleString()}</Td>
                      <Td>
                        <Badge size="lg">{service.availability}</Badge>
                      </Td>
                      <Td>
                        <Stack direction="row" spacing="2">
                          <Button colorScheme="green" onClick={() => router.push(`/services/edit/${service._id}`)}>Edit</Button>
                          <Button colorScheme="red" onClick={() => handleDelete(service._id)}>Delete</Button>
                        </Stack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
        </Box>
      </Layout>
    </>
  );
};

export default withAuth(ServicesList);