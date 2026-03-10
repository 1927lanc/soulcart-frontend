import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => API.post('/auth/register/', data);
export const loginUser = (data) => API.post('/auth/login/', data);
export const logoutUser = (data) => API.post('/auth/logout/', data);
export const getProfile = () => API.get('/auth/profile/');

export const getProducts = () => API.get('/products/');
export const getCategories = () => API.get('/products/categories/');

export const getCart = () => API.get('/cart/');
export const addToCart = (data) => API.post('/cart/add/', data);
export const removeFromCart = (data) => API.delete('/cart/remove/', { data });
export const clearCart = () => API.delete('/cart/clear/');

export const getOrders = () => API.get('/orders/');
export const createOrder = (data) => API.post('/orders/', data);