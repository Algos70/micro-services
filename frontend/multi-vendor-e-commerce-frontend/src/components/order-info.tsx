import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getUserOrders } from '@/requests/getOrder';
import { useAuth0 } from '@auth0/auth0-react';
import getOrderAxiosInstance from '@/requests/orderAxiosInstance';
import { AxiosError } from 'axios';




export function OrderInfo() {
    const { user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]); // State to store fetched orders
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); // State for handling errors

    const handleReturn = () => {
        navigate('/consumer');
    };

    const handleOrderDelete = async (orderId: string) => {
    try {
        const instance = await getOrderAxiosInstance(getAccessTokenSilently);
        if (!instance) {
            throw new Error("Axios instance could not be initialized.");
        }

        const response = await instance.delete(`/orders/${orderId}`);
        console.log(`Order ${orderId} deleted successfully`, response.data);

        // Optionally: refresh orders list or remove from state
        // Example: setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Failed to delete order:", error.response?.data || error.message);
        } else {
            console.error("Unexpected error:", (error as Error).message);
        }
    }
};


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const fetchedOrders = await getUserOrders(user?.email, getAccessTokenSilently);
                setOrders(fetchedOrders); // Assuming the API returns an array of orders
            } catch (err) {
                if(err?.status == 500) {
                    setError("No Order at the moment. Please create one.")
                } else {
                setError('Failed to fetch orders. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user?.email]);

    if (loading) {
        return <div>Loading...</div>; // Optionally show a loading spinner
    }

    if (error) {
        return <div className=' flex mt-100'><div /* logo-div */ onClick={handleReturn} className="w-1/2 flex">
            <img
                src="src/assets/landing-page/shop-svgrepo-com.svg"
                alt="Description of image"
                className="w-10 h-10 ml-60"
            />
            <p className="text-2xl ml-1 mb-1 italic font-bold">Shoply</p>
        </div>{error}</div>; // Display error message
    }

    console.log(orders)

    return (
        <div /* Container */ className="min-h-screen flex-col">
            <div /* Content */ className="h-30 w-1/1 flex">
                <div /* logo-div */ onClick={handleReturn} className="w-1/2 content-center items-center flex">
                    <img
                        src="src/assets/landing-page/shop-svgrepo-com.svg"
                        alt="Description of image"
                        className="w-10 h-10 ml-60"
                    />
                    <p className="text-2xl ml-1 mb-1 italic font-bold">Shoply</p>
                </div>
            </div>

            <div /* Information */ className="flex w-1/1 h-1/2">
                <div className="w-full p-4 ml-60">
                    <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
                    {orders.length > 0 ? (
                        <div>
                            {orders.map((order, index) => (
                                <div key={index} className="relative border p-4 mb-2 rounded-md shadow-md w-120">
                                    {/* Top right button */}
                                    <button
                                        className="absolute top-2  right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        onClick={() => handleOrderDelete(order.id)}
                                    >
                                        Delete Order
                                    </button>

                                    <h3 className="font-bold">Order {index + 1}</h3>
                                    <p>Status: {order.status}</p>
                                    <p>Delivery Date: {'Unknown'}</p>
                                    <h4 className="mt-2">Items:</h4>
                                    <ul>
                                        {order.items.map((item: any, idx: number) => (
                                            <li key={idx}>
                                                {item.product_id} - ${item.unit_price * item.quantity} - {item.quantity} items
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            ))}
                        </div>
                    ) : (
                        <p>No orders found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}