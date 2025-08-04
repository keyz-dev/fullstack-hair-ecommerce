// api.js
import axios from "axios";

const isProduction = import.meta.env.VITE_ENV === "production";

let API_BASE_URL;
if (isProduction) {
  API_BASE_URL = import.meta.env.VITE_REMOTE_BACKEND_API_URL;
} else {
  API_BASE_URL = import.meta.env.VITE_LOCAL_BACKEND_API_URL;
}

export { API_BASE_URL };

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
