import {
    VStack,
    Button,
    Text,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay, Box
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import UpdateCustomerDrawer from "../Components/Customer/UpdateCustomerDrawer.jsx";

const Sidebar = () => {
    const { customer, logOut } = useAuth();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    const handleLogout = () => {
        logOut();
        onClose();
        navigate("/");
    };

    const isAdmin = customer?.role === "ADMIN";

    return (
        <>
            <VStack
                bg="gray.800"
                color="white"
                h="100vh"
                w={{ base: "full", md: "250px" }}
                p={5}
                align="flex-start"
                spacing={6}
            >
                <Text fontSize="2xl" fontWeight="bold" mt={10}>
                    Customer Portal
                </Text>

                <VStack align="center" spacing={4} mt={6} w="full">
                    {/* Update button */}
                    {customer && (
                        <UpdateCustomerDrawer
                            customerId={customer.id}
                            initialValues={{
                                name: customer.name,
                                email: customer.email,
                                age: customer.age
                            }}
                            updateCustomerInState={() => {}}
                        >
                            <Button
                                variant="ghost"
                                colorScheme="whiteAlpha"
                                w="full"
                                size="lg"
                                fontSize="lg"
                            >
                                Update
                            </Button>
                        </UpdateCustomerDrawer>
                    )}

                    {/* Logout button */}
                    <Button
                        variant="ghost"
                        colorScheme="whiteAlpha"
                        w="full"
                        size="lg"
                        fontSize="lg"
                        onClick={onOpen}
                    >
                        Logout
                    </Button>
                </VStack>


            </VStack>

            {/* Logout confirmation */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Confirm Logout
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to logout?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleLogout} ml={3}>
                                Confirm
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default Sidebar;
