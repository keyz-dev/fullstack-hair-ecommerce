// api.js
import axios from "axios";

// export const API_BASE_URL = "http://192.168.5.1:5000/v2/api";
export const API_BASE_URL = "https://fullstack-hair-ecommerce.onrender.com/v2/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
