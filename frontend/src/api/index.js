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

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // Handle specific error cases
      if (status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (status === 403) {
        // Forbidden
        console.error("Access forbidden:", data.message);
      } else if (status >= 500) {
        // Server error
        console.error("Server error:", data.message);
      }
    } else if (error.request) {
      // Network error
      console.error("Network error:", error.message);
    } else {
      // Other error
      console.error("Error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
