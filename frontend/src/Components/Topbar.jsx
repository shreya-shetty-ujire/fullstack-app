import { Flex, Text, HStack, Avatar, Button } from "@chakra-ui/react";
import {useAuth} from "../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const Topbar = () => {
  const {customer }= useAuth();
  const navigate = useNavigate();

    useEffect(() => {
        console.log("🔐 Logged-in Customer Object:", customer);
    }, [customer]);

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
                <Text fontWeight="bold" fontSize="x-lg">{customer?.name}</Text>
                <Avatar size="sm" name={customer?.username} />
            </HStack>

        </Flex>
    );
};

export default Topbar;
