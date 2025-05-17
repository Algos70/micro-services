import getConsumerAxiosInstance from "@/requests/consumerAxiosInstance";

export async function createProduct(data: {
  category_id: string;
  description: string;
  image: string;
  name: string;
  price: number;
  stock: number;
  vendor_id: string;
}) {
  try {
    const axiosInstance = await getConsumerAxiosInstance();
    if (!axiosInstance) throw new Error("Axios instance is null");

    const response = await axiosInstance.post('/product', data);

    return response.data; // return response if needed
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
}
