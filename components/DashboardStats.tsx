import { useEffect, useState } from 'react';
import { SimpleGrid, Stat, StatLabel, StatNumber, Card } from '@chakra-ui/react';
import axios from 'axios';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    dailyEarnings: 0,
    monthlyEarnings: 0,
    totalServices: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/dashboard-stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing="6" mb="8">
      {/* Total Orders */}
      <Card p="4" boxShadow="lg">
        <Stat>
          <StatLabel>Total Orders</StatLabel>
          <StatNumber>{stats.totalOrders}</StatNumber>
        </Stat>
      </Card>

      {/* Daily Earnings */}
      <Card p="4" boxShadow="lg">
        <Stat>
          <StatLabel>Daily Earnings</StatLabel>
          <StatNumber>Rp. {stats.dailyEarnings.toLocaleString()}</StatNumber>
        </Stat>
      </Card>

      {/* Monthly Earnings */}
      <Card p="4" boxShadow="lg">
        <Stat>
          <StatLabel>Monthly Earnings</StatLabel>
          <StatNumber>Rp. {stats.monthlyEarnings.toLocaleString()}</StatNumber>
        </Stat>
      </Card>

      {/* Total Services */}
      <Card p="4" boxShadow="lg">
        <Stat>
          <StatLabel>Total Services</StatLabel>
          <StatNumber>{stats.totalServices}</StatNumber>
        </Stat>
      </Card>
    </SimpleGrid>
  );
};

export default DashboardStats;
