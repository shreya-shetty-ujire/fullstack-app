import { Box, VStack, Avatar, Text, HStack, Button } from "@chakra-ui/react";

const CustomerCard = ({ customer }) => (
    <Box
        borderWidth="1px"
        borderColor="gray.300"
        borderRadius="lg"
        p={4}
        bg="white"
        boxShadow="sm"
        minH="380px"
        display="flex"
        alignItems="center"
        justifyContent="center"
    >
        <VStack spacing={4} align="center" textAlign="center">
            <Avatar
                name={customer.name}
                src={customer.picture}
                boxSize="180px"
            />
            <Text fontWeight="bold" fontSize="x-large">{customer.name}</Text>

            <Text fontSize="sm" color="gray.700">{customer.email}</Text>

            <HStack spacing={2}>
                <Text fontSize="sm" color="gray.600">{customer.gender}</Text>
                <Text color="gray.400">|</Text>
                <Text fontSize="sm" color="gray.600">Age: {customer.age}</Text>
            </HStack>



            <HStack spacing={16} pt={4}>
                <Button bg="blue.400" _hover={{ bg: "blue.500" }} color="white" size="md">
                    Update
                </Button>
                <Button bg="red.400" _hover={{ bg: "red.500" }} color="white" size="md">
                    Delete
                </Button>
            </HStack>
        </VStack>
    </Box>
);

export default CustomerCard;
