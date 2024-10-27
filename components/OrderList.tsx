import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Text, Button } from '@chakra-ui/react';
import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from '../utils/alerts';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/api/orders', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    })
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error('Error fetching orders:', error));
  }, []);

  const deleteOrder = (orderId) => {
    showConfirmationAlert('Delete This Order?', 'This action cannot be undone, so think twice before deleting.')
      .then((result) => {
        if (result.isConfirmed) {
          // Perform delete request here
          fetch(`/api/orders/${orderId}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
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
    <>
    <Box w="100%" overflowX="auto" bg="white" boxShadow="md" borderRadius="md" p="4">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Trx. Number</Th>
            <Th>Name</Th>
            <Th>Service</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr key={order._id}>
              <Td>{order.transactionNumber}</Td>
              <Td>{order.name}</Td>
              <Td>{order.services}</Td>
              <Td>{order.status}</Td>
              <Td>
                <Button colorScheme="red" size="sm" onClick={() => deleteOrder(order._id)}>
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box></>
  );
};

export default OrderList;
