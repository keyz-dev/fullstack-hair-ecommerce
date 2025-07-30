import api from ".";

const URL_PREFIX = "/service";

export const serviceApi = {
  getAllServices: async (params = {}) => {
    const response = await api.get(`${URL_PREFIX}/`, { params });
    return response.data;
  },
  getService: async (id) => {
    const response = await api.get(`${URL_PREFIX}/${id}`);
    return response.data;
  },
  addService: async (data) => {
    const response = await api.post(`${URL_PREFIX}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  updateService: async (id, data) => {
    const response = await api.put(`${URL_PREFIX}/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  deleteService: async (id) => {
    const response = await api.delete(`${URL_PREFIX}/${id}`);
    return response.data;
  },
  getServiceStats: async () => {
    const response = await api.get(`${URL_PREFIX}/stats`);
    return response.data;
  },
}; 