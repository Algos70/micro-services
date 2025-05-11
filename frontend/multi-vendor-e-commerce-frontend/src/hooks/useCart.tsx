import { useEffect, useState } from 'react';
import { CartItem } from 'src/types';

const LOCAL_STORAGE_KEY = 'cartItems';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load from localStorage on first render
  useEffect(() => {
    const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Always add new item (even if it's a duplicate)
  const addItem = (item: CartItem) => {
    setCart(prev => [...prev, item]);
  };

  const removeItem = (id: string) => {
    const index = cart.findIndex(i => i.id === id);
    if (index !== -1) {
      const newCart = [...cart];
      newCart.splice(index, 1); // remove only the first matching instance
      setCart(newCart);
    }
  };

  const clearCart = () => setCart([]);

  return { cart, addItem, removeItem, clearCart };
};
