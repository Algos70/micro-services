import getConsumerAxiosInstance from "@/requests/consumerAxiosInstance";

export async function createCategory(data: {
  name: string;
  category_id: string;
}) {
  try {
    const axiosInstance = await getConsumerAxiosInstance();
    if (!axiosInstance) throw new Error("Axios instance is null");

    const response = await axiosInstance.post('/category', data);

    return response.data; // return response if needed
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
}
