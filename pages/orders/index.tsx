// pages/orders/index.tsx
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
import cookies from 'next-cookies';

const OrderList = ({ orders }) => {
  const router = useRouter();

  const handleDelete = async (id) => {
    const result = await showConfirmationAlert(
      'Delete This Order?',
      'This action cannot be undone, so think twice before deleting.'
    );
    if (!result.isConfirmed) return;

    const response = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });

    if (response.ok) {
      router.replace(router.asPath); // Refresh the page to fetch updated orders
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
          <Heading fontSize="2xl" mb="4">Orders</Heading>
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
                    <Td>{order.services?.name || 'N/A'}</Td>
                    <Td>
                      <Popover>
                        <PopoverTrigger>
                          <Button size="sm">View</Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>Order Brief</PopoverHeader>
                          <PopoverBody>
                            <Text fontWeight="bold">Brief:</Text>
                            <Text>{order.brief}</Text>
                            {order.uploadedFile && (
                              <>
                                <Text fontWeight="bold" mt={4}>Brief Document:</Text>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(order.uploadedFile, '_blank')}
                                >
                                  <Icon as={FiDownload} mr={1} /> Download
                                </Button>
                              </>
                            )}
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    <Td>Rp {order.price.toLocaleString()}</Td>
                    <Td><Badge>{order.status}</Badge></Td>
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

export async function getServerSideProps(context) {
  const { token } = cookies(context);

  const response = await fetch(`/api/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const orders = response.ok ? await response.json() : [];

  return {
    props: {
      orders,
    },
  };
}

export default withAuth(OrderList);