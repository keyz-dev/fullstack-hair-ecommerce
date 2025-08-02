import api from ".";

const URL_PREFIX = "/service";

export const serviceApi = {
  // Get all services (admin/staff only)
  getAllServices: async (params = {}) => {
    const response = await api.get(`${URL_PREFIX}/`, { params });
    return response.data;
  },

  // Get active services (public)
  getActiveServices: async (params = {}) => {
    const response = await api.get(`${URL_PREFIX}/active`, { params });
    return response.data;
  },

  // Get single service
  getService: async (id, params = {}) => {
    const response = await api.get(`${URL_PREFIX}/${id}`, { params });
    return response.data;
  },

  // Create service
  addService: async (data) => {
    const response = await api.post(`${URL_PREFIX}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update service
  updateService: async (id, data) => {
    const response = await api.put(`${URL_PREFIX}/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete service
  deleteService: async (id) => {
    const response = await api.delete(`${URL_PREFIX}/${id}`);
    return response.data;
  },

  // Get service statistics
  getServiceStats: async () => {
    const response = await api.get(`${URL_PREFIX}/stats`);
    return response.data;
  },

  // Assign staff to service
  assignStaff: async (serviceId, staffIds) => {
    const response = await api.post(`${URL_PREFIX}/${serviceId}/assign-staff`, {
      staffIds
    });
    return response.data;
  },

  // Activate service
  activateService: async (serviceId) => {
    const response = await api.post(`${URL_PREFIX}/${serviceId}/activate`);
    return response.data;
  },

  // Deactivate service
  deactivateService: async (serviceId) => {
    const response = await api.post(`${URL_PREFIX}/${serviceId}/deactivate`);
    return response.data;
  },
}; 