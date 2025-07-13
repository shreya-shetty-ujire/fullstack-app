import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./Components/pages/Signup";
import { Box } from "@chakra-ui/react";
import Signin from "./Components/pages/Signin";
import Dashboard from "./Components/pages/Dashboard";

function App() {
    return (
        <Box>
            <Routes>
                <Route path="/" element={< Signin/>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard/customers" element={<Dashboard />} />
            </Routes>
        </Box>
    );
}

export default App;
