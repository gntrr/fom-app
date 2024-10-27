import { Box, Text, Link, VStack, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, useBreakpointValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { RiDashboardFill, RiShoppingCart2Fill, RiStackFill } from "react-icons/ri";  // Importing icons

const Sidebar = ({ isOpen, onClose }) => {
  const router = useRouter();
  const isDrawer = useBreakpointValue({ base: true, md: false }); // Drawer for mobile, fixed sidebar for desktop

  const SidebarContent = () => (
    <VStack align="start" spacing="6" p="4">
      <Link href="/" color={router.pathname === '/' ? 'blue.500' : 'gray.600'} display="flex" alignItems="center">
        <RiDashboardFill size={24} style={{ marginRight: '8px' }} />  {/* Icon */}
        Dashboard
      </Link>
      <Link href="/orders" color={router.pathname === '/orders' ? 'blue.500' : 'gray.600'} display="flex" alignItems="center">
        <RiShoppingCart2Fill size={24} style={{ marginRight: '8px' }} />  {/* Icon */}
        Orders
      </Link>
      <Link href="/services" color={router.pathname === '/services' ? 'blue.500' : 'gray.600'} display="flex" alignItems="center">
        <RiStackFill size={24} style={{ marginRight: '8px' }} />  {/* Icon */}
        Services
      </Link>
      {/* Add more links as needed */}
    </VStack>
  );

  return isDrawer ? (
    <Drawer isOpen={isOpen} onClose={onClose} placement="left">
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  ) : (
    <Box
      as="nav"
      w="250px"
      p="4"
      bg="gray.100"
      minH="100vh"
      boxShadow="lg"
      position="fixed"
      top="0"
      left="0"
      zIndex="1000"
    >
        <Box w="100%" textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" mb="6">FOM-App</Text>
        </Box>
      <SidebarContent />
    </Box>
  );
};

export default Sidebar;
