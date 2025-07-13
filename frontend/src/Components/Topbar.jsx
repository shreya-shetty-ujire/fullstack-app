import { Flex, Text, HStack, Avatar } from "@chakra-ui/react";

const Topbar = () => {
    const user = {
        email: "john.doe@example.com",
        role: "Admin",
    };

    return (
        <Flex
            bg="white"
            px={6}
            py={4}
            align="center"
            justify="flex-end"
            shadow="sm"
            borderBottom="1px solid #e2e8f0"
        >
            <HStack spacing={4}>
                <Text fontSize="sm">{user.email}</Text>
                <Text fontSize="sm" color="gray.500">({user.role})</Text>
                <Avatar size="sm" name={user.email} />
            </HStack>
        </Flex>
    );
};

export default Topbar;
