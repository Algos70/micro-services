import axios, { AxiosInstance } from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Config } from '@/types.ts';

let instance: AxiosInstance | null = null;

export default async function getAuthAxiosInstance(): Promise<AxiosInstance | null> {
    if (!instance) {
        const configResponse = await axios.get('/config.json');
        const config: Config = configResponse.data;

        if (!config) return null;

        instance = axios.create({
            baseURL: config.AUTH_URL,
            timeout: 5000,
        });

        // Attach token to every request
        instance.interceptors.request.use(async (req) => {
            try {
                const { getAccessTokenSilently } = useAuth0();
                const token = await getAccessTokenSilently();
                req.headers.Authorization = `Bearer ${token}`;
            } catch (err) {
                console.error('Token fetch failed', err);
            }
            return req;
        });
    }

    return instance;
}
