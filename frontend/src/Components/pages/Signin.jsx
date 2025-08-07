import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Flex,
    FormLabel,
    Heading,
    Image,
    Input,
    Link,
    Stack,
    Text,
} from '@chakra-ui/react';
import {Form, Formik, useField} from "formik";
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";
import {useEffect} from "react";


const MyTextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props.name);

    return (
        <Box>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <Input {...field} {...props} />
            {meta.touched && meta.error ? (
                <Alert status="error" mt={2}>
                    <AlertIcon />
                    {meta.error}
                </Alert>
            ) : null}
        </Box>
    );
};
const SigninForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    return (
        <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={Yup.object({
                username: Yup.string()
                    .email("Invalid email address")
                    .required("Email is required"),
                password: Yup.string()
                    .max(20, "Password must be 20 characters or less")
                    .required("Password is required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);
                login(values)
                    .then(() => {
                        navigate("/dashboard/customers");
                        console.log("Successfully logged in");
                    })
                    .catch((err) => {
                        // You can also add a toast here using Chakra UI if preferred
                        console.error(err);
                        alert(
                            err?.response?.data?.message || "Login failed. Please try again."
                        );
                    })
                    .finally(() => {
                        setSubmitting(false);
                    });
            }}
        >
            {({ isSubmitting, isValid }) => (
                <Form>
                    <Stack spacing={4} mt={4}>
                        <MyTextInput
                            label="Email"
                            name="username"
                            type="email"
                            placeholder="you@example.com"
                        />
                        <MyTextInput
                            label="password"
                            name="password"
                            type="password"
                            placeholder="********"
                        />

                        <Button
                            type="submit"
                            colorScheme="blue"
                            isDisabled={!isValid || isSubmitting}
                        >
                            Login
                        </Button>
                    </Stack>
                </Form>
            )}
        </Formik>
    );
};


const Signin = () => {
    const {customer} =useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(customer) {
            navigate("/dashboard/customers");
        }
    }, [customer]);
    return (
        <Stack minH="100vh" direction={{ base: "column", md: "row" }}>
            <Flex p={8} flex={1} align="center" justify="center">
                <Stack spacing={4} w="full" maxW="md">
                    <Image src="/assets/logo3.png" boxSize="200px" alt="DevSphere Logo" alignSelf="center" />
                    <Heading fontSize="2xl" textAlign="center">
                        Login to your account
                    </Heading>

                    <SigninForm />


                    <Text textAlign="center">
                        Don&apos;t have an account?{" "}
                        <Link color="blue.500" href="/signup">
                            Register now
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

export default Signin;
