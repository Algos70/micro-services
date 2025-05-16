import axios, { AxiosInstance } from 'axios';
import { Config } from "@/types.ts";

let instance: AxiosInstance | null = null;

export default async function getOrderAxiosInstance(
    getIdTokenClaims: () => Promise<{ __raw: string } | undefined>
): Promise<AxiosInstance | null> {
    if (!instance) {
        const configResponse = await axios.get('/config.json');
        const config: Config = configResponse.data;
        if (!config) {
            return null;
        }
        instance = axios.create({
            baseURL: config.ORDER_URL,
            timeout: 5000,
        });

        // Attach token and idtoken claims to every request
        instance.interceptors.request.use(async (req) => {
            try {
                const claims = await getIdTokenClaims();
                req.headers.Authorization = claims?.__raw;
            } catch (err) {
                console.error('Error fetching token or idtoken claims:', err);
            }
            return req;
        });
    }
    return instance;
}