import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import { login as performLogin, getCustomerProfile } from "../api/client.js";
import jwtDecode from "jwt-decode";


const AuthContext = createContext({});

const AuthProvider = ({ children }) => {

    const [customer, setCustomer] = useState(null);


    const login = async (usernameAndPassword) => {
        try {
            const response = await performLogin(usernameAndPassword);
            const jwtToken = response.headers["authorization"];

            localStorage.setItem("token", jwtToken);

            const decoded = jwtDecode(jwtToken);
            console.log("Decoded token:", decoded);

            if (Date.now() >= decoded.exp * 1000) {
                throw new Error("Token is expired");
            }

            const profileRes = await getCustomerProfile();

            setCustomer(profileRes.data);

            return response;
        } catch (error) {
            throw error;
        }
    };


    const setCustomerFromToken = async () => {
        let token = localStorage.getItem("token");
        if (!token) return;

        try {
            const decoded = jwtDecode(token);
            if (Date.now() >= decoded.exp * 1000) {
                logOut();
                return;
            }

            const profileRes = await getCustomerProfile(); // ✅ Fetch real profile
            setCustomer(profileRes.data);
        } catch (error) {
            logOut();
        }
    };

    useEffect(() => {
        const init = async () => {
            await setCustomerFromToken();
        };
        init();
    }, []);

    const logOut = () => {
        localStorage.removeItem("token")
        setCustomer(null)
    }

    const isCustomerAuthenticated = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            return false;
        }
        const { exp: expiration } = jwtDecode(token);
        if (Date.now() > expiration * 1000) {
            logOut()
            return false;
        }
        return true;
    }
    return (
        <AuthContext.Provider value={{
            customer,
            login,
            logOut,
            isCustomerAuthenticated,
            setCustomerFromToken,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;

