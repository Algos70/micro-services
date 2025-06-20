import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/CartContext.tsx';
import { useEffect, useState } from 'react';
import { getProductById } from '@/requests/getProductById.ts';
import Spinner from './spinner'; // Optional: loading spinner
import { startOrder } from '@/requests/startOrder.ts';
import { useAuth0 } from '@auth0/auth0-react';
import Homepage from '../../public/assets/landing-page/shop-svgrepo-com.svg'

interface Product {
  Id: string;
  Name: string;
  Description: string;
  Price: number;
  Stock: number;
  VendorId: string;
  Image: string;
  CategoryId: string;
  quantity?: number; // Add the optional quantity property
}

export function OrderUi() {
  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { cart, removeItem, clearCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleReturn = () => {
    navigate('/consumer');
  };

  const handleOrderStart = async () => {
    try {
      if (!user?.email) {
        console.error('User email is missing');
        return;
      }

      const orderPayload = {
        user_email: user.email,
        vendor_email: 'vendor@outlook.com',
        delivery_address: 'Kepez/Antalya',
        description: 'Order placed through Shoply',
        status: 'Pending',
        items: products.map((product) => ({
          product_id: product.Id,
          quantity: product.quantity || 1,
          unit_price: product.Price,
        })),
        payment_method: 'Credit Card',
      };
      console.log(orderPayload);
      await startOrder(orderPayload, getAccessTokenSilently);
      console.log('Order is succesfull.');
      clearCart();
    } catch (error) {
      console.log('An error occured: ' + error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const productCounts: { [id: string]: number } = {}; // Object to track item counts
      const productMap: { [id: string]: Product } = {}; // Object to store unique products

      // Fetch each product from the API
      for (const item of cart) {
        const product = await getProductById(item.id);
        if (product) {
          // Track the quantity of each product in the cart
          productCounts[item.id] = (productCounts[item.id] || 0) + 1;

          // Add product to the map if not already added (avoids duplication)
          if (!productMap[product.Id]) {
            productMap[product.Id] = product;
          }
        }
      }

      // Combine the fetched products with their quantities
      const productsWithQuantity = Object.values(productMap).map((product) => ({
        ...product,
        quantity: productCounts[product.Id], // Set quantity on each product
      }));

      setProducts(productsWithQuantity);
      setLoading(false);
    };

    fetchProducts();
  }, [cart]);

  if (loading) return <Spinner />;

  // Calculate total price
  const total = products.reduce((sum, product) => {
    return sum + product.Price * (product.quantity || 0); // Ensure we use quantity if it exists
  }, 0);

  return (
    <div /* Container */ className="min-h-screen flex-col ">
      <div /* Content */ className="h-30 w-1/1 flex ">
        <div /* logo-div */ className="w-1/2 content-center items-center flex">
          <img onClick={handleReturn} src={Homepage} alt="Description of image" className="w-10 h-10 ml-60" />
          <p className="text-2xl ml-1 mb-1 italic font-bold">Shoply</p>
        </div>
      </div>
      <div /* Information */ className=" flex w-1/1 h-1">
        <div className="grid grid-cols-5 flex flex-row gap-4 p-4 w-1/2 ml-54">
          {products.map((product) => (
            <div key={product.Id} className="border rounded-md p-4 shadow-md">
              <img src={product.Image} alt={product.Name} className="w-32 h-32 object-cover mb-2 rounded" />
              <h2 className="max-w-xs truncate text-lg font-semibold">{product.Name}</h2>
              <p className="text-gray-600">{product.Description}</p>
              <p className="font-bold">${product.Price * (product.quantity ?? 0)}</p>
              {product.quantity && <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>}
              <button onClick={() => removeItem(product.Id)} className="mt-2 text-red-600 hover:underline text-sm">
                Remove one
              </button>
            </div>
          ))}
        </div>
        <div className="w-1/2 max-w-md mx-auto mt-6 border-t  pt-4">
          <div className="flex justify-between text-lg font-semibold mb-4">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleOrderStart} // Replace with real order handler
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Place Order
          </button>
          <div className="w-2/8 max-w-md mx-auto mt-4">
            <button onClick={() => clearCart()} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition">
              Remove All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
