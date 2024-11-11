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
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Checkbox,
  ButtonGroup,
  Tooltip
} from '@chakra-ui/react';
import { FiEdit, FiTrash2, FiPlus, FiMessageCircle, FiDownload, FiSearch } from 'react-icons/fi';
import withAuth from '../../components/withAuth';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from '../../utils/alerts';
import Cookies from 'js-cookie';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedOrders, setSelectedOrders] = useState([]);
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
  }, [token]);

  const filteredOrders = orders
    .sort((a, b) => {
      const dateA = new Date(a.deadline).getTime();
      const dateB = new Date(b.deadline).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });    

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

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order._id));
    }
  };

  const handleBulkDelete = async () => {
    const confirmed = await showConfirmationAlert(
      'Delete Selected Orders?',
      `This action cannot be undone. Are you sure you want to delete ${selectedOrders.length} orders?`
    );
    if (!confirmed.isConfirmed) return;

    try {
      await Promise.all(
        selectedOrders.map((orderId) =>
          fetch(`/api/orders/${orderId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setOrders(orders.filter((order) => !selectedOrders.includes(order._id)));
      setSelectedOrders([]);
      showSuccessAlert('Deleted!', 'The selected orders have been deleted.');
    } catch {
      showErrorAlert('Error', 'Failed to delete the selected orders.');
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
          
          <HStack mb="4">
            {/* Search Input */}
            <InputGroup mb="4" maxW="300px">
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search transactions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            {/* Sort Buttons */}
            <HStack spacing="4" alignItems="center" mb="4">
              <ButtonGroup size="md" isAttached>
                <Tooltip label="Sort Ascending" aria-label="Sort Ascending">
                <Button
                  onClick={() => setSortOrder('asc')}
                  isActive={sortOrder === 'asc'}
                  aria-label="Sort Ascending"
                >
                  <FaSortAmountUp />
                </Button>
                </Tooltip>
                <Tooltip label="Sort Descending" aria-label="Sort Descending">
                <Button
                  onClick={() => setSortOrder('desc')}
                  isActive={sortOrder === 'desc'}
                  aria-label="Sort Descending"
                >
                  <FaSortAmountDown />
                </Button>
                </Tooltip>
              </ButtonGroup>
            </HStack>
            <Tooltip label="Add New Order" aria-label="Add New Order" display={{ base: 'block', md: 'none' }}>
              <Button colorScheme="blue" size="md" mb="4" onClick={() => router.push('/orders/add')}>
                <Icon as={FiPlus} mr={1} /> 
                <Text as="span" display={{ base: 'none', md: 'inline' }}>Add New Order</Text>
              </Button>
            </Tooltip>
          </HStack>

          {/* Action Bar for Bulk Actions */}
          {selectedOrders.length > 0 && (
            <Box bg="gray.100" p="4" mb="4">
              <HStack spacing="4">
                <Button colorScheme="red" onClick={handleBulkDelete}>
                  Delete {selectedOrders.length} Orders
                </Button>
              </HStack>
            </Box>
          )}

          <Box w="100%" overflowX="auto" bg="white" shadow="md" borderRadius="md" p="4">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>
                    <Checkbox
                      isChecked={selectedOrders.length === filteredOrders.length}
                      onChange={handleSelectAll}
                    />
                  </Th>
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
                {filteredOrders.map((order) => (
                  <Tr key={order._id}>
                    <Td>
                      <Checkbox
                        isChecked={selectedOrders.includes(order._id)}
                        onChange={() => handleSelectOrder(order._id)}
                      />
                    </Td>
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
                            <Text mb={6}>{new Date(order.deadline).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                            <Text fontWeight="bold" mb={2}>Brief Document:</Text>
                            <Button
                              size="sm"
                              variant="outline"
                              isDisabled={!order.uploadedFile}
                              onClick={() => window.open(order.uploadedFile, '_blank')}
                            >
                              <Icon as={FiDownload} mr={1} /> Download
                            </Button>
                            {!order.uploadedFile && <Text mt={2} color="gray.500">No file uploaded</Text>}
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    <Td>Rp {order.price.toLocaleString()}</Td>
                    <Td><Badge colorScheme="green" size="md">{order.status}</Badge></Td>
                    <Td>
                      <HStack spacing="2">
                        <Tooltip label="Edit Order" aria-label="Edit Order">
                        <IconButton
                          icon={<FiEdit />}
                          aria-label="Edit"
                          onClick={() => router.push(`/orders/edit/${order._id}`)}
                          />
                          </Tooltip>
                          <Tooltip label="Delete Order" aria-label="Delete Order">
                          <IconButton
                            icon={<FiTrash2 />}
                            aria-label="Delete"
                            colorScheme="red"
                            onClick={() => handleDelete(order._id)}
                          />
                          </Tooltip>
                          <Tooltip label="Chat with Customer" aria-label="Chat with Customer">
                          <IconButton
                            icon={<FiMessageCircle />}
                            aria-label="Chat"
                            colorScheme="blue"
                            onClick={() => window.open(`https://wa.me/${order.whatsappNumber}`, '_blank')}
                          />
                          </Tooltip>
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
  