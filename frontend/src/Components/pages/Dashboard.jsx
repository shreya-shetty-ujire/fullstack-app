import { Box, Flex, Grid, useBreakpointValue } from "@chakra-ui/react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import CustomerCard from "../CustomerCard";
import { useAuth } from "../../context/AuthContext";
import { getCustomers } from "../../api/client.js";
import {useEffect, useState} from "react";

const Dashboard = () => {
    const columns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4, xl: 5 });
    const {logOut} = useAuth();
    const [customers, setCustomers] = useState([]);

    useEffect(()=>{
        getCustomers()
            .then(res=>{
                setCustomers(res.data);
            })
            .catch(err=>{
                console.error("Failed to fetch customers", err);
            });
    }, []);

    return (
        <Flex h="100vh" bg="gray.50">
            <Sidebar />
            <Flex direction="column" flex="1" overflow="hidden">
                <Topbar />
                <Box p={6} overflowY="auto" flex="1">
                    <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={6}>
                        {customers.map((cust) => (
                            <CustomerCard key={cust.id} customer={cust} />
                        ))}
                    </Grid>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Dashboard;
