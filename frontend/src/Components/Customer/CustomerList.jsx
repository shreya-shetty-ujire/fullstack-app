import { useEffect, useState } from "react";
import { getCustomers, deleteCustomer } from "../../api/client.js";
import CustomerCard from "./CustomerCard.jsx";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { errorNotification, successNotification } from "../../api/notification.js";

export default function CustomerList() {
    const [customers, setCustomers] = useState([]);

    const fetchCustomers = async () => {
        try {
            const res = await getCustomers();
            setCustomers(res.data);
        } catch (err) {
            errorNotification("Error", "Failed to fetch customers");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCustomer(id);
            successNotification("Deleted", "Customer deleted successfully");
            fetchCustomers();
        } catch (err) {
            errorNotification("Error", "Failed to delete customer");
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <Box p={6}>
            <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                {customers.map((customer) => (
                    <CustomerCard
                        key={customer.id}
                        customer={customer}
                        fetchCustomers={fetchCustomers}
                        handleDelete={() => handleDelete(customer.id)}
                    />
                ))}
            </SimpleGrid>
        </Box>
    );
}
