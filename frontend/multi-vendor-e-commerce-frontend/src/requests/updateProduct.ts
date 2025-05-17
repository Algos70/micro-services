import getConsumerAxiosInstance from "@/requests/consumerAxiosInstance";

export async function updateProduct(data: {
    product_id: string;
    description: string;
    image: string;
    name: string;
    price: number;
}) {
    try {
        const axiosInstance = await getConsumerAxiosInstance();
        if (!axiosInstance) throw new Error("Axios instance is null");

        await axiosInstance.put(`/product/name/${data.product_id}`, { name: data.name });
        await axiosInstance.put(`/product/price/${data.product_id}`, { price: data.price });
        await axiosInstance.put(`/product/image/${data.product_id}`, { description: data.image });
        await axiosInstance.put(`/product/description/${data.product_id}`, { description: data.description });


        console.log("Product fields updated successfully.");
    } catch (error) {
        console.error("Failed to create product:", error);
        throw error;
    }
}
