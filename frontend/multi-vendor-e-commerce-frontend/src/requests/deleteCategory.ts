import getConsumerAxiosInstance from "@/requests/consumerAxiosInstance";

export async function deleteCategory(id: string) {
  try {
    const axiosInstance = await getConsumerAxiosInstance();
    if (!axiosInstance) throw new Error("Axios instance is null");

    const response = await axiosInstance.delete(`/category/${id}`);
    return response.data; // Optionally return something
  } catch (error) {
    console.error("Failed to delete category:", error);
    throw error;
  }
}
