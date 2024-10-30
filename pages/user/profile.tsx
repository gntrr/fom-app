import { useState, useEffect } from 'react';
import UpdateProfileForm from '../../components/UpdateProfileForm';
import withAuth from '../../components/withAuth';
import LoadingScreen from '../../components/LoadingScreen';
import Layout from '../../components/Layout';
import { Box, Text, Avatar, VStack, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from '../../utils/alerts';
import Cookies from 'js-cookie';

const UserProfile = () => {
  const [user, setUser] = useState({ name: '', email: '', profileImage: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) throw new Error('No token found');

        const response = await fetch('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) setUser(data);
        else showErrorAlert('Error', data.message);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        showErrorAlert('Error', 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdate = (updatedUser) => setUser(updatedUser);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Head>
        <title>Profile | FOM-App</title>
        <meta name="description" content="Update your profile and manage your account information." />
      </Head>
      <Layout>
        <Box p="8">
          <Text fontSize="2xl" fontWeight="bold" mb="6">Profile Settings</Text>
          
          <Stack direction={{ base: 'column', md: 'row' }} spacing={14} alignItems="flex-start">
            <VStack alignItems="start">
              <Avatar size="2xl" src={user.profileImage} mb={4} />
              <Text fontSize="xl" fontWeight="bold">{user.name}</Text>
              <Text color="gray.500">{user.email}</Text>
            </VStack>
            
            <UpdateProfileForm user={user} onUpdate={handleUpdate} />
          </Stack>
        </Box>
      </Layout>
    </>
  );
};

export default withAuth(UserProfile);
