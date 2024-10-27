import { Box, Text, SimpleGrid, GridItem } from '@chakra-ui/react';
import DashboardStats from '../components/DashboardStats';
import EarningsChart from '../components/EarningsChart';
import OrderList from '../components/OrderList';
import withAuth from '../components/withAuth';
import Layout from '../components/Layout';
import Head from 'next/head';

const Dashboard = () => {
  return (
    <>
    <Head>
        <title>Dashboard | FOM-App</title>
        <meta name="description" content="Manage your freelance orders in the Dashboard." />
    </Head>
    <Layout>
      <Box p="8">
        {/* Page Title */}
        <Text fontSize="2xl" fontWeight="bold" mb="6">Dashboard</Text>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Unified Responsive Grid for Chart and Order List */}
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing={6}
          mt={6}
          w="100%"
        >
          {/* Earnings Chart - Takes full width on mobile, half on desktop */}
          <GridItem w="100%">
            <Text fontSize="xl" fontWeight="bold" mb="6" mt="6">Earning Chart</Text>
            <EarningsChart />
          </GridItem>

          {/* Order List - Takes full width on mobile, half on desktop */}
          <GridItem w="100%">
            <Text fontSize="xl" fontWeight="bold" mb="6" mt="6">Recent Orders</Text>
            <OrderList />
          </GridItem>
        </SimpleGrid>
      </Box>
    </Layout></>
  );
};

export default withAuth(Dashboard);
