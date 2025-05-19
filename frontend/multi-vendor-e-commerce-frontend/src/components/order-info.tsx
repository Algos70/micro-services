import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserOrders } from '@/requests/getOrder';
import { useAuth0 } from '@auth0/auth0-react';
import getOrderAxiosInstance from '@/requests/orderAxiosInstance';
import { AxiosError } from 'axios';
import { getProductById } from '@/requests/getProductById'; // Make sure this is correctly imported
import Homepage from '../../public/assets/landing-page/shop-svgrepo-com.svg'

export function OrderInfo() {
  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  interface OrderItem {
    product_id: string;
    unit_price: number;
    quantity: number;
  }

  interface Order {
    id: string;
    status: string;
    items: OrderItem[];
    // Add other fields as needed
  }

  const [orders, setOrders] = useState<Order[]>([]); // State to store fetched orders
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // State for handling errors
  const [productNames, setProductNames] = useState<Record<string, string>>({});

  const handleReturn = () => {
    navigate('/consumer');
  };

  const handleOrderDelete = async (orderId: string) => {
    try {
      const instance = await getOrderAxiosInstance(getAccessTokenSilently);
      if (!instance) {
        throw new Error('Axios instance could not be initialized.');
      }

      const response = await instance.delete(`/orders/${orderId}`);
      console.log(`Order ${orderId} deleted successfully`, response.data);

      // Optionally: refresh orders list or remove from state
      // Example: setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Failed to delete order:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', (error as Error).message);
      }
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.email) {
          setError('Could not find user email.');
          setLoading(false);
          return;
        }
        const fetchedOrders = await getUserOrders(user.email, getAccessTokenSilently);
        setOrders(fetchedOrders);

        const productIds: string[] = Array.from(new Set((fetchedOrders as Order[]).flatMap((order: Order) => order.items.map((item: OrderItem) => item.product_id))));

        // Fetch all product names
        const nameMap: Record<string, string> = {};
        await Promise.all(
          productIds.map(async (id: string) => {
            try {
              const product = (await getProductById(id as string)) as { Name?: string } | null;
              nameMap[id] = product && product.Name ? product.Name : 'Unknown';
            } catch {
              nameMap[id] = 'Unknown';
            }
          })
        );
        setProductNames(nameMap);
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'status' in err && (err as { status?: number }).status === 500) {
          setError('No Order at the moment. Please create one.');
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
    return (
      <div className=" flex mt-100">
        <div /* logo-div */ onClick={handleReturn} className="w-1/2 flex">
          <img src={Homepage} alt="Description of image" className="w-10 h-10 ml-60" />
          <p className="text-2xl ml-1 mb-1 italic font-bold">Shoply</p>
        </div>
        {error}
      </div>
    ); // Display error message
  }

  return (
    <div /* Container */ className="min-h-screen flex-col">
      <div /* Content */ className="h-30 w-1/1 flex">
        <div /* logo-div */ onClick={handleReturn} className="w-1/2 content-center items-center flex">
          <img src={Homepage} alt="Description of image" className="w-10 h-10 ml-60" />
          <p className="text-2xl ml-1 mb-1 italic font-bold">Shoply</p>
        </div>
      </div>

      <div /* Information */ className="flex w-1/1 h-1/2">
        <div className="w-full p-4 ml-60">
          <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
          {orders.length > 0 ? (
            <div>
              {orders.map((order: Order, index: number) => (
                <div key={index} className="relative border p-4 mb-2 rounded-md shadow-md w-120">
                  {/* Top right button */}
                  <button className="absolute top-2  right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleOrderDelete(order.id)}>
                    Delete Order
                  </button>

                  <h3 className="font-bold">Order {index + 1}</h3>
                  <p>Status: {order.status}</p>
                  <p>Delivery Date: {'Unknown'}</p>
                  <h4 className="mt-2">Items:</h4>
                  <ul>
                    {order.items.map((item: OrderItem, idx: number) => (
                      <li key={idx}>
                        {productNames[item.product_id] || item.product_id} - ${item.unit_price * item.quantity} - {item.quantity} items
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
