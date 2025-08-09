import api from ".";

const URL_PREFIX = "/product";

export const productApi = {
  getAllProducts: async (params = {}) => {
    const response = await api.get(`${URL_PREFIX}/`, { params });
    return response.data;
  },
  getProduct: async (id) => {
    const response = await api.get(`${URL_PREFIX}/${id}`);
    return response.data;
  },
  addProduct: async (data) => {
    // Create FormData object for multipart/form-data
    const formData = new FormData();

    // Handle productImages separately (files)
    if (data.productImages && Array.isArray(data.productImages)) {
      data.productImages.forEach((file, index) => {
        formData.append("productImages", file);
      });
    }

    // Handle all other fields
    Object.keys(data).forEach((key) => {
      if (key !== "productImages") {
        const value = data[key];
        if (typeof value === "object" && value !== null) {
          // Convert objects and arrays to JSON strings
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    Object.keys(formData.entries()).forEach((key) => {
      console.log(key);
    });

    const response = await api.post(`${URL_PREFIX}/`, formData);
    return response.data;
  },
  updateProduct: async (id, data) => {
    // Create FormData object for multipart/form-data
    const formData = new FormData();

    // Handle productImages separately (files)
    if (data.productImages && Array.isArray(data.productImages)) {
      data.productImages.forEach((file, index) => {
        formData.append("productImages", file);
      });
    }

    // Handle all other fields
    Object.keys(data).forEach((key) => {
      if (key !== "productImages") {
        const value = data[key];
        if (typeof value === "object" && value !== null) {
          // Convert objects and arrays to JSON strings
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    const response = await api.put(`${URL_PREFIX}/${id}`, formData);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`${URL_PREFIX}/${id}`);
    return response.data;
  },
  getProductStats: async () => {
    const response = await api.get(`${URL_PREFIX}/stats`);
    return response.data;
  },
};
