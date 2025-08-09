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
    const formData = new FormData();

    if (data.productImages && Array.isArray(data.productImages)) {
      data.productImages.forEach((file) => {
        formData.append("productImages", file);
      });
    }

    Object.keys(data).forEach((key) => {
      if (key !== "productImages") {
        const value = data[key];
        if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    const response = await api.post(`${URL_PREFIX}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  updateProduct: async (id, data) => {
    const response = await api.put(`${URL_PREFIX}/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
