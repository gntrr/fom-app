import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box } from '@chakra-ui/react';
import axios from 'axios';
import Cookies from 'js-cookie';

const EarningsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = Cookies.get('token');
    const fetchEarnings = async () => {
      try {
        const response = await axios.get('/api/earnings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching earnings data:', error);
      }
    };

    fetchEarnings();
  }, []);

  return (
    <>
    <Box w="100%" h="300px" bg="white" boxShadow="md" borderRadius="md" pr={4} py={4}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="earnings" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Box></>
  );
};

export default EarningsChart;
