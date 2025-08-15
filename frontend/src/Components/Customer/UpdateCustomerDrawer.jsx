import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, useDisclosure } from "@chakra-ui/react";
import UpdateCustomerForm from "./UpdateCustomerForm.jsx";

const UpdateCustomerDrawer = ({ initialValues, customerId, updateCustomerInState, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box onClick={onOpen} cursor="pointer">
                {children ? children : (
                    <Button bg="blue.400" _hover={{ bg: "blue.500" }} color="white" size="md">
                        Update
                    </Button>
                )}
            </Box>

            <Drawer isOpen={isOpen} onClose={onClose} size="xl">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Update Customer</DrawerHeader>
                    <DrawerBody>
                        <UpdateCustomerForm
                            initialValues={initialValues}
                            customerId={customerId}
                            updateCustomerInState={updateCustomerInState}
                            onClose={onClose}
                        />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default UpdateCustomerDrawer;
