import axios from 'axios';
import { useAuthStore } from './stores/authStore';

const api = axios.create({
  baseURL: 'http://localhost:9000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers['Authorization'] = `Bearer ${authStore.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/*
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // e.g., redirect to login, or clear store
    }
    return Promise.reject(err);
  }
);*/

export default api;
