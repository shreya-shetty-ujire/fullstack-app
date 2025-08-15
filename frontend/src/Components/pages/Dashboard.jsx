import { Box, Flex, Grid, Button, HStack, Text, useBreakpointValue } from "@chakra-ui/react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import CustomerCard from "../Customer/CustomerCard.jsx";
import { useAuth } from "../../context/AuthContext";
import { getCustomers, deleteCustomer } from "../../api/client.js";
import { useEffect, useState } from "react";
import { errorNotification, successNotification } from "../../api/notification.js";

const Dashboard = () => {
    const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4, xl: 5 });
    const { customer } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await getCustomers();
            setCustomers(res.data); // all customers
        } catch (err) {
            console.error("Failed to fetch customers", err);
            errorNotification("Error", "Failed to fetch customers");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCustomer(id);
            successNotification("Deleted", "Customer deleted successfully");
            await fetchCustomers();
        } catch (err) {
            errorNotification("Error", "Failed to delete customer");
        }
    };

    const updateCustomerInState = (customerId, updatedData) => {
        setCustomers(prev =>
            prev.map(c => (c.id === customerId ? { ...c, ...updatedData } : c))
        );
    };

    const nonAdminCustomers = customers.filter(
        cust => !cust.roles?.includes("ROLE_ADMIN")
    );

    const pagedCustomers = nonAdminCustomers.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    return (
        <Flex h="100vh" bg="gray.50">
            <Sidebar />
            <Flex direction="column" flex="1" overflow="hidden">
                <Topbar />
                <Box p={6} overflowY="auto" flex="1">
                    <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={6}>
                        {pagedCustomers.map(cust => (
                            <CustomerCard
                                key={cust.id}
                                customer={cust}
                                fetchCustomers={fetchCustomers}
                                handleDelete={() => handleDelete(cust.id)}
                                updateCustomerInState={updateCustomerInState}
                                currentUser={customer}
                                role={customer.roles}
                            />
                        ))}
                    </Grid>

                    {/* Pagination controls */}
                    <HStack spacing={4} mt={6} justify="center">
                        <Button
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            isDisabled={page === 1}
                        >
                            Prev
                        </Button>
                        <Text>
                            Page {page} of {Math.ceil(nonAdminCustomers.length / pageSize)}
                        </Text>
                        <Button
                            onClick={() =>
                                setPage(prev =>
                                    prev * pageSize < nonAdminCustomers.length ? prev + 1 : prev
                                )
                            }
                            isDisabled={page * pageSize >= nonAdminCustomers.length}
                        >
                            Next
                        </Button>
                    </HStack>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Dashboard;
