import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Button, Badge, IconButton } from '@chakra-ui/react';
import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from '../utils/alerts';
import Cookies from 'js-cookie';
import { FiEdit } from 'react-icons/fi';
import router from 'next/router';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const token = Cookies.get('token');

  useEffect(() => {
    fetch('/api/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        // Sort by deadline in descending order and take the latest 5 orders
        const sortedOrders = data
          .sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
          .slice(0, 5);
        setOrders(sortedOrders);
      })
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  const deleteOrder = (orderId) => {
    showConfirmationAlert('Delete This Order?', 'This action cannot be undone, so think twice before deleting.')
      .then((result) => {
        if (result.isConfirmed) {
          fetch(`/api/orders/${orderId}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
            .then((response) => {
              if (response.ok) {
                setOrders(orders.filter((order) => order._id !== orderId));
                showSuccessAlert('Deleted!', 'The order has been deleted.');
              } else {
                showErrorAlert('Error', 'Failed to delete the order.');
              }
            })
            .catch(() => {
              showErrorAlert('Error', 'Failed to delete the order.');
            });
        }
      });
  };

  return (
    <Box w="100%" overflowX="auto" bg="white" boxShadow="md" borderRadius="md" p="4">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Name</Th>
            <Th>Service</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order, index) => (
            <Tr key={order._id}>
              {/* Numbering the orders */}
              <Td>{index + 1}</Td>
              <Td>{order.name}</Td>
              <Td>{order.services.name}</Td>
              <Td>
                <Badge colorScheme={order.status === 'done' ? 'green' : 'red'}>
                  {order.status}
                </Badge>
              </Td>
              <Td>
                {/* Edit Button Icon */}
                <IconButton
                  icon={<FiEdit />}
                  aria-label="Edit"
                  onClick={() => router.push(`/orders/edit/${order._id}`)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default OrderList;
