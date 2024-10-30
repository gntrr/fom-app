import { useEffect, useState } from 'react';
import { SimpleGrid, Stat, StatLabel, StatNumber, Card, HStack, Icon } from '@chakra-ui/react';
import axios from 'axios';
import { HiCurrencyDollar, HiCube, HiShoppingBag } from "react-icons/hi";

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
        const timezoneOffset = new Date().getTimezoneOffset();
        const response = await axios.get(`/api/dashboard-stats?timezoneOffset=${timezoneOffset}`, {
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
          <HStack justify="space-between">
            <StatLabel>Total Orders</StatLabel>
            <Icon color="gray.600" fontSize={24} >
              <HiShoppingBag />
            </Icon>
          </HStack>
          <StatNumber>{stats.totalOrders}</StatNumber>
        </Stat>
      </Card>

      {/* Daily Earnings */}
      <Card p="4" boxShadow="lg">
        <Stat>
          <HStack justify="space-between">
            <StatLabel>Daily Earnings</StatLabel>
            <Icon color="gray.600" fontSize={24} >
              <HiCurrencyDollar />
            </Icon>
          </HStack>
          <StatNumber>Rp. {stats.dailyEarnings.toLocaleString()}</StatNumber>
        </Stat>
      </Card>

      {/* Monthly Earnings */}
      <Card p="4" boxShadow="lg">
        <Stat>
          <HStack justify="space-between">
            <StatLabel>Monthly Earnings</StatLabel>
            <Icon color="gray.600" fontSize={24} >
              <HiCurrencyDollar />
            </Icon>
          </HStack>
          <StatNumber>Rp. {stats.monthlyEarnings.toLocaleString()}</StatNumber>
        </Stat>
      </Card>

      {/* Total Services */}
      <Card p="4" boxShadow="lg">
        <Stat>
          <HStack justify="space-between">
            <StatLabel>Total Services</StatLabel>
            <Icon color="gray.600" fontSize={24} >
              <HiCube />
            </Icon>
          </HStack>
          <StatNumber>{stats.totalServices}</StatNumber>
        </Stat>
      </Card>
    </SimpleGrid>
  );
};

export default DashboardStats;
