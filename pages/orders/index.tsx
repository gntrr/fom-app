import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  IconButton,
  useToast,
  HStack,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  Text,
  Icon,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiPlus, FiMessageCircle, FiDownload } from 'react-icons/fi';
import withAuth from '../../components/withAuth';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from '../../utils/alerts';
import Cookies from 'js-cookie';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const router = useRouter();
  const toast = useToast();
  const token = Cookies.get('token');

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    const result = await showConfirmationAlert('Delete This Order?', 'This action cannot be undone, so think twice before deleting.');
    if (!result.isConfirmed) return;

    const response = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (response.ok) {
      setOrders(orders.filter((order) => order._id !== id));
      showSuccessAlert('Deleted!', 'The order has been deleted.');
    } else {
      showErrorAlert('Error', 'Failed to delete the order.');
    }
  };

  return (
    <>
      <Head>
        <title>Order List | FOM-App</title>
        <meta name="description" content="List of all orders." />
      </Head>
      <Layout>
        <Box p="8">
          <Heading fontSize="2xl" mb="4">
            Orders
          </Heading>
          <HStack mb="8">
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={() => router.push('/orders/add')}
            >
              Add Order
            </Button>
          </HStack>
          <Box w="100%" overflowX="auto" bg="white" shadow="md" borderRadius="md" p="4">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Trx Number</Th>
                  <Th>Cust. Name</Th>
                  <Th>Service</Th>
                  <Th>Brief</Th>
                  <Th>Price</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order) => (
                  <Tr key={order._id}>
                    <Td>{order.transactionNumber}</Td>
                    <Td>{order.name}</Td>
                    <Td>{order.services.name}</Td>
                    <Td>
                      <Popover>
                        <PopoverTrigger>
                          <Button size="sm">View</Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>Order Brief</PopoverHeader>
                          <PopoverBody mb={2} mt={2}>
                            <Text fontWeight="bold">Brief:</Text>
                            <Text mb={6}>{order.brief}</Text>
                            <Text fontWeight="bold" mb={2}>Deadline:</Text>
                            {/* Format the deadline date (e.g., "Wednesday, 1 September 2021") */}
                            <Text mb={6}>{new Date(order.deadline).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                            <Text fontWeight="bold" mb={2}>Brief Document:</Text>
                            <Button
                              size="sm"
                              variant="outline"
                              // Check if there is a file URL available or not
                              // If not, disable the button
                              isDisabled={!order.uploadedFile}
                              onClick={() => window.open(order.uploadedFile, '_blank')}
                            >
                              <Icon as={FiDownload} mr={1} /> Download
                            </Button>
                            {/* If there is no file URL, show a message */}
                            {!order.uploadedFile && <Text mt={2} color="gray.500">No file uploaded</Text>}
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    <Td>Rp {order.price.toLocaleString()}</Td>
                    <Td><Badge colorScheme="green" size="md">{order.status}</Badge></Td>
                    <Td>
                      <HStack spacing="2">
                        <IconButton
                          icon={<FiEdit />}
                          aria-label="Edit"
                          onClick={() => router.push(`/orders/edit/${order._id}`)}
                        />
                        <IconButton
                          icon={<FiTrash2 />}
                          aria-label="Delete"
                          colorScheme="red"
                          onClick={() => handleDelete(order._id)}
                        />
                        <IconButton
                          icon={<FiMessageCircle />}
                          aria-label="Chat"
                          colorScheme="blue"
                          onClick={() => window.open(`https://wa.me/${order.whatsappNumber}`, '_blank')}
                        />
                      </HStack>
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

export default withAuth(OrderList);
