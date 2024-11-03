import { Flex, Box, useDisclosure } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  // Handle opening and closing of sidebar for mobile view
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex direction="column" h="100vh">
      {/* Fixed Navbar */}
      <Navbar onOpenSidebar={onOpen} /> {/* Pass onOpen to Navbar */}

      <Flex flex="1" overflowY="auto"> {/* Allow vertical scrolling */}
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} onClose={onClose} /> {/* Pass isOpen and onClose to Sidebar */}

        {/* Main content */}
        <Box
          as="main"
          flex="1"
          p="2"
          ml={{ base: '0', md: '250px' }}  /* Sidebar space on larger screens */
          bg="gray.50"
          overflowY="auto"
          pt="70px"
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
