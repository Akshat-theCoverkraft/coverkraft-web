// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 👉 Intercept responses globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // 👇 Dispatch a custom event for session expiry
      window.dispatchEvent(new CustomEvent("sessionExpired"));
    }

    if (status === 404) {
      // 👇 Dispatch a custom event for 404
      window.dispatchEvent(new CustomEvent("notFound"));
    }

    // You can also handle 403, 500 etc similarly

    return Promise.reject(error);
  }
);

export default axiosInstance;
