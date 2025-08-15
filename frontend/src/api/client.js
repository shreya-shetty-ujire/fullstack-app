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
export const updateCustomer = async (id, update) => {
    try {
        return await instance.put(
            `${import.meta.env.VITE_API_BASE_URL}/api/customers/${id}`,
            update,
            getAuthConfig()
        )
    } catch (e) {
        throw e;
    }
}

export const deleteCustomer = async (id) => {
    try {
        return await instance.delete(
            `${import.meta.env.VITE_API_BASE_URL}/api/customers/${id}`,
            getAuthConfig()
        )
    } catch (e) {
        throw e;
    }
}

export const uploadCustomerProfilePicture = async (id, formData) => {
    try {
        return instance.post(
            `/api/customers/${id}/profile-image`,
            formData,
            {
                headers: {
                    ...getAuthConfig().headers // no Content-Type here
                }
            }
        );
    } catch (e) {
        throw e;
    }
};

export const fetchCustomerProfilePicture = async (id) => {
    try {
        const response = await instance.get(
            `/api/customers/${id}/profile-image`,
            {
                ...getAuthConfig(),
                responseType: "blob"
            }
        );

        return URL.createObjectURL(response.data);
    } catch (e) {
        throw e;
    }
};


export const customerProfilePictureUrl = (id) =>
    `${import.meta.env.VITE_API_BASE_URL}/api/customers/${id}/profile-image`;

