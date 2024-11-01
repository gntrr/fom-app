import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EarningsChart = () => {
  const [chartData, setChartData] = useState<{ labels: string[]; datasets: any[] }>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const token = Cookies.get('token');
    const fetchEarnings = async () => {
      try {
        const response = await axios.get('/api/earnings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const labels = response.data.map((item: any) => item.month);
        const earningsData = response.data.map((item: any) => item.earnings);
        
        setChartData({
          labels,
          datasets: [
            {
              label: 'Earnings',
              data: earningsData,
              borderColor: '#8884d8',
              backgroundColor: 'rgba(136, 132, 216, 0.2)',
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching earnings data:', error);
      }
    };

    fetchEarnings();
  }, []);

  return (
    <Box w="100%" bg="white" boxShadow="md" borderRadius="md" px={2}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
          },
          scales: {
            y: {
              ticks: {
                callback: function (value) {
                  if (typeof value === 'number') {
                    return value >= 1000 ? `${value / 1000}K` : value;
                  }
                  return value;
                },
              },
            },
          },
        }}
        height={300} // Optional: set height to control aspect ratio
      />
    </Box>
  );
};

export default EarningsChart;