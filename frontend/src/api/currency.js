import api from './index';

export const currencyApi = {
  // Get all currencies (admin only)
  getAllCurrencies: async () => {
    const response = await api.get('/currency');
    return response.data;
  },

  // Get active currencies (public)
  getActiveCurrencies: async () => {
    const response = await api.get('/currency/active');
    return response.data;
  },

  // Get currency by ID
  getCurrencyById: async (id) => {
    const response = await api.get(`/currency/${id}`);
    return response.data;
  },

  // Create new currency
  createCurrency: async (currencyData) => {
    const response = await api.post('/currency', currencyData);
    return response.data;
  },

  // Update currency
  updateCurrency: async (id, currencyData) => {
    const response = await api.put(`/currency/${id}`, currencyData);
    return response.data;
  },

  // Delete currency
  deleteCurrency: async (id) => {
    const response = await api.delete(`/currency/${id}`);
    return response.data;
  },

  // Set base currency
  setBaseCurrency: async (id) => {
    const response = await api.patch(`/currency/${id}/set-base`);
    return response.data;
  },
}; 