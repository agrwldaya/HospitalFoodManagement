import axios from 'axios';
import useAuthStore from '../store/store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://hospitalfoodmanagement.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;