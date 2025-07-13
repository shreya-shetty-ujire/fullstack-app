import { VStack, Button, Text } from "@chakra-ui/react";

const Sidebar = () => (
    <VStack
        bg="gray.800"
        color="white"
        h="100vh"
        w={{ base: "full", md: "250px" }}
        p={5}
        align="flex-start"
        spacing={6}
    >
        <Text fontSize="2xl" fontWeight="bold" mt={10}>
            Customer Portal
        </Text>

        <VStack align="flex-start" spacing={4} mt={6} w="full">
            <Button variant="ghost" colorScheme="whiteAlpha" w="full" size="lg">
                Home
            </Button>
            <Button variant="ghost" colorScheme="whiteAlpha" w="full" size="lg">
                Customers
            </Button>
            <Button variant="ghost" colorScheme="whiteAlpha" w="full" size="lg">
                Settings
            </Button>
        </VStack>
    </VStack>
);

export default Sidebar;
