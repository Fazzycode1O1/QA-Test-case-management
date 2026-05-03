import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qams_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const existingToken = localStorage.getItem('qams_token');
      if (existingToken) {
        localStorage.removeItem('qams_token');
        localStorage.removeItem('qams_user');
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
