import React from 'react';
import { deleteCookie } from 'cookies-next';
import Router from 'next/router';

import {
Box,
Flex,
Icon,
useColorModeValue,
Drawer,
DrawerContent,
Text,
useDisclosure,
Button,
Show
} from '@chakra-ui/react';

import {
FiCalendar,
FiClock,
FiHome,
FiUser,
FiLogOut,
} from 'react-icons/fi'; 

/**
* @desc Main export for the sidebar navigation component
*/
const SimpleSidebar = () => {
    const { isOpen, onClose } = useDisclosure();

    return (
        <Box minH="100vh">
            <SidebarContent
            onClose={() => onClose}
            display={{ base: 'none', md: 'block' }}
            />
            <Drawer
            autoFocus={false}
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            returnFocusOnClose={false}
            onOverlayClick={onClose}
            size="full">
            <DrawerContent>
                <SidebarContent onClose={onClose} />
            </DrawerContent>
            </Drawer>
        </Box>
);
}

/**
* @desc Content helper for the sidebar component
*/
const SidebarContent = () => {
    return (
    <Show above='1000px'>
        <Box
            bg={useColorModeValue('teal.600', 'teal.600')}
            borderRight="1px"
            borderRightColor={useColorModeValue('teal.600', 'teal.600')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full">
            <Flex h="20" alignItems="center" mx="9" justifyContent="space-between">
                <Text fontSize="4xl" color="white" fontFamily="sans-serif" fontWeight="medium">
                    PropertyU
                </Text>
            </Flex>
            <Button onClick={() => Router.push('/calendar_view')} leftIcon={<Icon as={FiCalendar} w={6} h={6}/>} width="full" mt={4} variant="ghost" color="white" _hover={{ bg: "teal.400" }}>
                <Text fontSize="2xl" color="white" fontFamily="system-ui" fontWeight="normal">
                    Calendar
                </Text>
            </Button>
            <Button onClick={() => Router.push('/schedule')} leftIcon={<Icon as={FiClock} w={6} h={6}/>} width="full" mt={6} variant="ghost" color="white" _hover={{ bg: "teal.400" }}>
            <Text fontSize="2xl" color="white" fontFamily="system-ui" fontWeight="normal">
                    Schedule
                </Text>
            </Button>
            <Button onClick={() => Router.push('/property_list')} leftIcon={<Icon as={FiHome} w={6} h={6}/>} width="full" mt={6} variant="ghost" color="white" _hover={{ bg: "teal.400" }}>
            <Text fontSize="2xl" color="white" fontFamily="system-ui" fontWeight="normal">
                    Properties
                </Text>
            </Button>
            <Button onClick={() => Router.push('/profile')} leftIcon={<Icon as={FiUser} w={6} h={6}/>} width="full" mt={6} variant="ghost" color="white" _hover={{ bg: "teal.400" }}>
                <Text fontSize="2xl" color="white" fontFamily="system-ui" fontWeight="normal">
                    Profile
                </Text>
            </Button>
            <Button onClick={LogOut} leftIcon={<Icon as={FiLogOut} w={6} h={6}/>} width="full" mt={12} variant="ghost" color="white" _hover={{ bg: "red.400" }}>
                <Text fontSize="2xl" color="white" fontFamily="system-ui" fontWeight="normal">
                    Log Out
                </Text>
            </Button>
        </Box>
    </Show>
    );
};

/**
* @desc Handler for OnClick logout button
*/
const LogOut = () => {
    deleteCookie("token")
    Router.push("/login")
}

export default SimpleSidebar