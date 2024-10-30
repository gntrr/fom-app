import { Box, Flex, Avatar, Menu, MenuButton, MenuList, MenuItem, Text, Button, IconButton } from '@chakra-ui/react';
import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FaUserEdit, FaSignOutAlt } from 'react-icons/fa';  // Import icons for profile and logout
import { showConfirmationAlert } from '../utils/alerts';
import Cookies from 'js-cookie';

const Navbar = ({ onOpenSidebar }) => {
  const router = useRouter();
  const [user, setUser] = useState({ name: '', profileImage: '' });

  useEffect(() => {
    // Fetch the user data (you can replace this with actual API logic)
    const token = Cookies.get('token');
    const fetchUser = async () => {
      const token = Cookies.get('token');
      if (token) {
        const response = await fetch('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    showConfirmationAlert('Are you sure?', 'You will be logged out.')
      .then((result) => {
        if (result.isConfirmed) {
          Cookies.remove('token'); // Remove the token from cookies
          router.push('/login');
        }
      });
  };

  return (
    <Flex
      as="nav"
      bg="gray.100"
      p="4"
      justify="space-between"
      align="center"
      boxShadow="md"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="1000"
    >
      {/* Button to open sidebar (for mobile) */}
      <Button
        display={{ base: 'block', md: 'none' }}
        onClick={onOpenSidebar}
        variant="ghost"
        size="lg"
        aria-label="Open Menu"
      >
        <HamburgerIcon />
      </Button>

      {/* Empty space to center the user dropdown */}
      <Box flex="1" />

      {/* User Info and Dropdown */}
      <Flex alignItems="center" display={{ base: 'flex', md: 'flex' }} mr={4}>
        {/* User Avatar */}
        <Avatar size="sm" src={user.profileImage} name={user.name} />
        
        {/* User Name (hidden on mobile) */}
        <Text
          ml="4"
          fontWeight="bold"
          display={{ base: 'none', md: 'block' }}  // Hidden on mobile
        >
          {user.name}
        </Text>

        {/* Dropdown Menu */}
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<ChevronDownIcon />}
            variant="ghost"
            ml="2"
          />
          <MenuList>
            <MenuItem icon={<FaUserEdit />} onClick={() => router.push('/user/profile')}>Edit Profile</MenuItem>
            <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout} color="red.500">
                Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Navbar;
