import getConsumerAxiosInstance from "@/requests/consumerAxiosInstance";

export async function getProductsByVendor(vendorId: string) {
    try {
        const axiosInstance = await getConsumerAxiosInstance();
        if (!axiosInstance) throw new Error("Axios instance is null");

        const response = await axiosInstance.get(`/product/vendor/${vendorId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch vendor products:", error);
        throw error;
    }
}
