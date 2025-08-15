import {
    Button,
    Flex,
    Heading,
    Image,
    Input,
    Link,
    Stack,
    Text,
    FormControl,
    FormLabel,
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";
import CreateCustomerForm from "../Customer/CreateCustomerForm.jsx";

const Signup = () => {
    const {customer, setCustomerFromToken} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        if(customer){
            navigate("/");
        }
    },[customer, navigate]);


    return (
        <Stack minH="100vh" direction={{ base: "column", md: "row" }}>
            <Flex p={8} flex={1} align="center" justify="center">
                <Stack spacing={4} w="full" maxW="md">
                    <Image
                        src="/assets/logo3.png"
                        boxSize="200px"
                        alt="Logo"
                        alignSelf="center"
                    />
                    <Heading fontSize="2xl" mb={4} textAlign="center">
                        Register for an account
                    </Heading>
                    <CreateCustomerForm
                        onSuccess={(token) => {
                            localStorage.setItem("token", token);
                            setCustomerFromToken(token);
                            navigate("/");
                        }}
                    />
                    <Text textAlign="center">
                        Already have an account?{" "}
                        <Link color="blue.500" href="/">
                            Login now
                        </Link>
                    </Text>
                </Stack>
            </Flex>

            <Flex
                flex={1}
                p={10}
                direction="column"
                align="center"
                justify="center"
                bgGradient="linear(to-r, blue.600, purple.600)"
                color="white"
            >
                <Text fontSize="6xl" fontWeight="bold" mb={4} textAlign="center">
                    Customer Portal
                </Text>

            </Flex>
        </Stack>
    );
};

export default Signup;