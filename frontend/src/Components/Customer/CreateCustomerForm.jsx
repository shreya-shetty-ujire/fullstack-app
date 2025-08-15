import { Box, Stack, Button, Alert, AlertIcon, FormLabel, Input, Select } from "@chakra-ui/react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { saveCustomer } from "../../api/client.js";
import { successNotification, errorNotification } from "../../api/notification.js";

// 🔹 Reusable Input Field Component
const MyTextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <Box>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <Input {...field} {...props} />
            {meta.touched && meta.error && (
                <Alert status="error" mt={2}>
                    <AlertIcon />
                    {meta.error}
                </Alert>
            )}
        </Box>
    );
};

// 🔹 Reusable Select Field Component
const MySelect = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <Box>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <Select {...field} {...props} />
            {meta.touched && meta.error && (
                <Alert status="error" mt={2}>
                    <AlertIcon />
                    {meta.error}
                </Alert>
            )}
        </Box>
    );
};

const CreateCustomerForm = ({ onSuccess }) => {
    return (
        <Formik
            initialValues={{
                name: "",
                email: "",
                age: "",
                password: "",
                gender: "",
            }}
            validationSchema={Yup.object({
                name: Yup.string().max(15, "Must be 15 characters or less").required("Required"),
                email: Yup.string().email("Invalid email").required("Required"),
                age: Yup.number().typeError("Age must be a number").min(16).max(100).required("Required"),
                password: Yup.string().min(4).max(15).required("Required"),
                gender: Yup.string().oneOf(["MALE", "FEMALE"]).required("Required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);
                saveCustomer(values)
                    .then(res => {
                        successNotification("Customer Saved", `${values.name} successfully registered`);
                        const token = res.headers["authorization"];
                        if (onSuccess && token) onSuccess(token);
                    })
                    .catch(err => {
                        errorNotification("Error", err.response?.data?.message || "Registration failed");
                    })
                    .finally(() => setSubmitting(false));
            }}
        >
            {({ isValid, isSubmitting }) => (
                <Form>
                    <Stack spacing={4}>
                        <MyTextInput label="Name" name="name" type="text" placeholder="Jane" />
                        <MyTextInput label="Email" name="email" type="email" placeholder="jane@example.com" />
                        <MyTextInput label="Age" name="age" type="number" placeholder="25" />
                        <MyTextInput label="Password" name="password" type="password" placeholder="Password" />
                        <MySelect label="Gender" name="gender">
                            <option value="">Select gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </MySelect>
                        <Button type="submit" colorScheme="blue" isDisabled={!isValid || isSubmitting} isLoading={isSubmitting}>
                            Register
                        </Button>
                    </Stack>
                </Form>
            )}
        </Formik>
    );
};

export default CreateCustomerForm;
