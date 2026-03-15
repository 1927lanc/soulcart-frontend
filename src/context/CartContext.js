import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const token = localStorage.getItem('soulcart_token');

  const headers = token ? { Authorization: `Token ${token}` } : {};

  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await axios.get('https://soulcart.onrender.com/api/cart/', { headers });
      setCartItems(res.data.items);
      setCartCount(res.data.item_count);
      setCartTotal(res.data.total);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (product) => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    try {
      const res = await axios.post('https://soulcart.onrender.com/api/cart/',
        { product_id: product.id, quantity: 1 },
        { headers }
      );
      setCartItems(res.data.items);
      setCartCount(res.data.item_count);
      setCartTotal(res.data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await axios.delete('https://soulcart.onrender.com/api/cart/',
        { headers, data: { item_id: itemId } }
      );
      setCartItems(res.data.items);
      setCartCount(res.data.item_count);
      setCartTotal(res.data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await axios.patch(
        `https://soulcart.onrender.com/api/cart/update/${itemId}/`,
        { quantity },
        { headers }
      );
      setCartItems(res.data.items);
      setCartCount(res.data.item_count);
      setCartTotal(res.data.total);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartTotal,
      addToCart, removeFromCart, updateQuantity, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
