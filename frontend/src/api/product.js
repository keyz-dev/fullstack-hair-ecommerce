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
    const response = await api.post(`${URL_PREFIX}/`, data, {
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