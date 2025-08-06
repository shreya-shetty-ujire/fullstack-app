import instance from "./axios";

export const saveCustomer = async (customer) => {
    try {
        return await instance.post("/api/customers", customer);
    } catch (e) {
        throw e;
    }
};