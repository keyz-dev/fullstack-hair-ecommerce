import api from ".";

const URL_PREFIX = "/category";

export const categoryApi = {
  getAllCategories: async () => {
    const response = await api.get(`${URL_PREFIX}/`);
    return response.data;
  },
  getCategory: async (id) => {
    const response = await api.get(`${URL_PREFIX}/${id}`);
    return response.data;
  },
  createCategory: async (data) => {
    const response = await api.post(`${URL_PREFIX}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  updateCategory: async (id, data) => {
    const response = await api.put(`${URL_PREFIX}/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`${URL_PREFIX}/${id}`);
    return response.data;
  },
  filterCategories: async (filters) => {
    // filters: { name, status, ... }
    const response = await api.get(`${URL_PREFIX}/filter`, { params: filters });
    return response.data;
  },
};
