import axios, { AxiosInstance } from 'axios';
import { Config } from '@/types.ts';

let instance: AxiosInstance | null = null;

export default async function getAuthAxiosInstance(
    getAccessTokenSilently: () => Promise<string>,
    getIdTokenClaims: () => Promise<{ __raw: string } | undefined>
): Promise<AxiosInstance | null> {
    if (!instance) {
        const configResponse = await axios.get('/config.json');
        const config: Config = configResponse.data;

        if (!config) return null;

        instance = axios.create({
            baseURL: config.AUTH_URL,
            timeout: 5000,
        });

        // Attach token and idtoken claims to every request
        instance.interceptors.request.use(async (req) => {
            try {
                const token = await getAccessTokenSilently();
                const claims = await getIdTokenClaims();
                req.headers.Authorization = `Bearer ${token}`;
                req.headers.idtoken = claims?.__raw || ''; // Add idtoken claims to the headers
            } catch (err) {
                console.error('Error fetching token or idtoken claims:', err);
            }
            return req;
        });
    }

    return instance;
}

