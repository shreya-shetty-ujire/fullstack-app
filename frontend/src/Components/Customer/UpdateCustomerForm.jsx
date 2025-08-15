import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    FormLabel,
    Image,
    Stack,
    VStack,
    Input,
} from "@chakra-ui/react";
import {
    customerProfilePictureUrl,
    updateCustomer,
    uploadCustomerProfilePicture,
} from "../../api/client.js";
import { errorNotification, successNotification } from "../../api/notification.js";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

// Text input field component
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

// Dropzone for selecting profile picture
const MyDropzone = ({ setSelectedFile }) => {
    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setSelectedFile(acceptedFiles[0]);
            }
        },
        [setSelectedFile]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] } });

    return (
        <Box
            {...getRootProps()}
            w="100%"
            textAlign="center"
            border="dashed"
            borderColor="gray.200"
            borderRadius="3xl"
            p={6}
            cursor="pointer"
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the picture here ...</p>
            ) : (
                <p>Drag 'n' drop picture here, or click to select picture</p>
            )}
        </Box>
    );
};

// Main form
const UpdateCustomerForm = ({ initialValues, customerId, onClose, updateCustomerInState }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(customerProfilePictureUrl(customerId));

    // Preview selected file
    useEffect(() => {
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [selectedFile]);

    return (
        <Box position="relative" minH="300px">
            <VStack spacing={5} mb={5}>
                <Image borderRadius="full" boxSize="150px" objectFit="cover" src={previewUrl} />
                <MyDropzone setSelectedFile={setSelectedFile} />
            </VStack>

            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object({
                    name: Yup.string().max(50, "Must be 50 characters or less").required("Required"),
                    email: Yup.string().email("Invalid email address").required("Required"),
                    age: Yup.number()
                        .min(16, "Must be at least 16 years old")
                        .max(100, "Must be less than 100 years old")
                        .required("Required"),
                })}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true);
                    try {
                        // Update customer details
                        await updateCustomer(customerId, values);

                        // Upload profile picture if selected
                        if (selectedFile) {
                            const formData = new FormData();
                            formData.append("file", selectedFile);
                            await uploadCustomerProfilePicture(customerId, formData);
                        }

                        successNotification(
                            "Customer Updated",
                            `${values.name} has been successfully updated`
                        );

                        // Update local state if callback provided
                        if (updateCustomerInState) {
                            updateCustomerInState(customerId, values);
                        }

                        if (onClose) onClose();
                    } catch (err) {
                        errorNotification(err.response?.data?.message || "Update failed", "");
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ dirty, isSubmitting }) => {
                    const isChanged = dirty || selectedFile;
                    return (
                        <Form>
                            <Stack spacing="24px">
                                <MyTextInput label="Name" name="name" type="text" />
                                <MyTextInput label="Email" name="email" type="email" />
                                <MyTextInput label="Age" name="age" type="number" />
                            </Stack>

                            <Button
                                type="submit"
                                colorScheme="teal"
                                position="absolute"
                                bottom="0"
                                right="0"
                                m={4}
                                isDisabled={!isChanged || isSubmitting}
                                isLoading={isSubmitting}
                            >
                                Update
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
        </Box>
    );
};

export default UpdateCustomerForm;
