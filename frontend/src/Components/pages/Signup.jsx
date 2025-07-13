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

const Signup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
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
        alert(`Signed up as: ${form.name}`);
        navigate("/dashboard/customers");
    };

    return (
        <Stack minH="100vh" direction={{ base: "column", md: "row" }}>
            {/* Left side */}
            <Flex p={8} flex={1} align="center" justify="center">
                <Stack spacing={4} w="full" maxW="md">
                    <Image
                        src="/assets/logo3.png"
                        boxSize="200px"
                        alt="DevSphere Logo"
                        alignSelf="center"
                    />
                    <Heading fontSize="2xl" textAlign="center">
                        Register for an account
                    </Heading>

                    <form onSubmit={handleSubmit}>
                        <FormControl id="name" mb={4} isRequired>
                            <FormLabel>Name</FormLabel>
                            <Input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your name"
                            />
                        </FormControl>

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
                            Register
                        </Button>
                    </form>

                    <Text textAlign="center">
                        Already have an account?{" "}
                        <Link color="blue.500" href="/">
                            Login now
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


            </Flex>
        </Stack>
    );
};

export default Signup;
