import axios from 'axios';

// Live Render Backend Fallback URL
const FALLBACK_BACKEND_URL = 'https://synccore-cgqc.onrender.com';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? FALLBACK_BACKEND_URL : '');

const API = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL.replace(/\/$/, '')}/api` : '/api',
});

// Interceptor to attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('synccore_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
