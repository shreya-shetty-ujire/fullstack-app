
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signin = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can later connect this to your auth logic
        alert(`Logged in as: ${form.email}`);
        navigate("/dashboard/customers");
    };

    return (
        <Stack minH="100vh" direction={{ base: "column", md: "row" }}>
            {/* Left side form */}
            <Flex p={8} flex={1} align="center" justify="center">
                <Stack spacing={4} w="full" maxW="md">
                    <Image
                        src="/assets/logo3.png"
                        boxSize="200px"
                        alt="DevSphere Logo"
                        alignSelf="center"
                    />
                    <Heading fontSize="2xl" textAlign="center">
                        Login to your account
                    </Heading>

                    <form onSubmit={handleSubmit}>
                        <FormControl id="email" mb={4} isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                            />
                        </FormControl>

                        <FormControl id="password" mb={6} isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="********"
                            />
                        </FormControl>

                        <Button type="submit" colorScheme="blue" width="full">
                            Login
                        </Button>
                    </form>

                    <Text textAlign="center">
                        Don't have an account?{" "}
                        <Link color="blue.500" href="/signup">
                            Register now
                        </Link>
                    </Text>
                </Stack>
            </Flex>

            {/* Right side banner */}
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

export default Signin;
