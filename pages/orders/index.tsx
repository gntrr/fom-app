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
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiPlus, FiPhone, FiPhoneCall, FiMessageCircle } from 'react-icons/fi';
import withAuth from '../../components/withAuth';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from '../../utils/alerts';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/orders', 
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      const data = await response.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    const result = await showConfirmationAlert('Delete This Order?', 'This action cannot be undone, so think twice before deleting.');
    if (!result.isConfirmed) return

    const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
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
          <Box w="100%" overflowX="auto" bg="white" shadow={"md"} borderRadius="md" p="4">
            <Table variant="simple">
                <Thead>
                <Tr>
                    <Th>Trx Number</Th>
                    <Th>Name</Th>
                    <Th>Service</Th>
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
                    <Td>{order.services}</Td>
                    <Td>Rp {order.price.toLocaleString()}</Td>
                    <Td>{order.status}</Td>
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
                            onClick={() => <a href={`https://wa.me/${order.whatsappNumber}`} target="_blank" />}
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
