// api.js
import axios from "axios";

// Production URL
// export const API_BASE_URL = "https://fullstack-hair-ecommerce.onrender.com/v2/api";

// Development URL
export const API_BASE_URL = "http://localhost:5000/v2/api";

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
