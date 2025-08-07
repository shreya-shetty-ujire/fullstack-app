import instance from "./axios";

export const saveCustomer = async (customer) => {
    try {
        return await instance.post("/api/customers", customer);
    } catch (e) {
        throw e;
    }
};

export const login = async (usernameAndPassword) => {
    try {
        return await instance.post("/api/auth/login", usernameAndPassword);
    } catch (e) {
        throw e;
    }
};

const getAuthConfig = ()=> ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

export const getCustomers = async () => {
    try{
        return await instance.get("/api/customers",
            getAuthConfig());
    } catch(e){
        throw e;
    }
};

export const getCustomerProfile = async () => {
    try {
        return await instance.get("/api/customers/profile", getAuthConfig());
    } catch (e) {
        throw e;
    }
};


