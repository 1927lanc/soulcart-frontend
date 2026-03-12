import axios from 'axios';

const API = axios.create({
  baseURL: 'https://soulcart.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const registerUser = (data) => API.post('/users/auth/register/', data);
export const loginUser = (data) => API.post('/users/auth/login/', data);
export const logoutUser = (data) => API.post('/users/auth/logout/', data);
export const getProfile = () => API.get('/users/auth/profile/');

export const getProducts = () => API.get('/products/');
export const getCategories = () => API.get('/categories/');

export const getCart = () => API.get('/cart/');
export const addToCart = (data) => API.post('/cart/add/', data);
export const removeFromCart = (data) => API.delete('/cart/remove/', { data });
export const clearCart = () => API.delete('/cart/clear/');

export const getOrders = () => API.get('/orders/');
export const createOrder = (data) => API.post('/orders/', data);