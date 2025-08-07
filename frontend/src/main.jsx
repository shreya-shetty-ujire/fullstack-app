import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import AuthProvider from "./context/AuthContext.jsx"; // ✅ Import AuthProvider

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <ChakraProvider>
                <AuthProvider> {/* ✅ Wrap App inside AuthProvider */}
                    <App />
                </AuthProvider>
            </ChakraProvider>
        </BrowserRouter>
    </StrictMode>
)
