import {useEffect, useRef, useState} from "react";
import {
    Box,
    VStack,
    Avatar,
    Text,
    HStack,
    Button,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from "@chakra-ui/react";
import UpdateCustomerDrawer from "./UpdateCustomerDrawer.jsx";
import { fetchCustomerProfilePicture} from "../../api/client.js";

const CustomerCard = ({ customer, handleDelete, updateCustomerInState, role }) => {
    const [isOpen, setIsOpen] = useState(false);
    const cancelRef = useRef();

    const onDelete = async () => {
        setIsOpen(false);
        await handleDelete(customer.id);
    };
    const [profileUrl, setProfileUrl] = useState(null);

    useEffect(() => {
        let isMounted = true;

        fetchCustomerProfilePicture(customer.id)
            .then(url => {
                if (isMounted) setProfileUrl(url);
            })
            .catch(err => console.error(err));

        return () => {
            isMounted = false;
        };
    }, [customer.id]);


    return (
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
                    src={profileUrl}
                    boxSize="180px"
                />
                <Text fontWeight="bold" fontSize="x-large">
                    {customer.name}
                </Text>
                <Text fontSize="sm" color="gray.700">
                    {customer.email}
                </Text>
                <HStack spacing={2}>
                    <Text fontSize="sm" color="gray.600">
                        {customer.gender}
                    </Text>
                    <Text color="gray.400">|</Text>
                    <Text fontSize="sm" color="gray.600">
                        Age: {customer.age}
                    </Text>
                </HStack>

                <HStack spacing={16} pt={4}>
                    {role?.includes("ROLE_ADMIN") && (
                        <>
                            <UpdateCustomerDrawer
                                initialValues={{
                                    name: customer.name,
                                    email: customer.email,
                                    age: customer.age,
                                }}
                                customerId={customer.id}
                                updateCustomerInState={updateCustomerInState}
                            />
                            <Button
                                bg="red.400"
                                _hover={{ bg: "red.500" }}
                                color="white"
                                size="md"
                                onClick={() => setIsOpen(true)}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </HStack>
            </VStack>

            {/* Confirmation Dialog */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsOpen(false)}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Customer
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to delete <b>{customer.name}</b>? This action cannot
                            be undone.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={onDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default CustomerCard;
