import api from './index';

export const paymentMethodApi = {
  // Get all payment methods (admin only)
  getAllPaymentMethods: async () => {
    const response = await api.get('/paymentMethod');
    return response.data;
  },

  // Get active payment methods (public)
  getActivePaymentMethods: async () => {
    const response = await api.get('/paymentMethod/active');
    return response.data;
  },

  // Get payment method types
  getPaymentMethodTypes: async () => {
    const response = await api.get('/paymentMethod/types');
    return response.data;
  },

  // Get payment method by ID
  getPaymentMethodById: async (id) => {
    const response = await api.get(`/paymentMethod/${id}`);
    return response.data;
  },

  // Create new payment method
  createPaymentMethod: async (paymentMethodData) => {
    const response = await api.post('/paymentMethod', paymentMethodData);
    return response.data;
  },

  // Update payment method
  updatePaymentMethod: async (id, paymentMethodData) => {
    const response = await api.put(`/paymentMethod/${id}`, paymentMethodData);
    return response.data;
  },

  // Update payment method configuration
  updatePaymentMethodConfig: async (id, configData) => {
    const response = await api.put(`/paymentMethod/${id}/config`, configData);
    return response.data;
  },

  // Verify payment method configuration
  verifyPaymentMethodConfig: async (id) => {
    const response = await api.get(`/paymentMethod/${id}/verify`);
    return response.data;
  },

  // Delete payment method
  deletePaymentMethod: async (id) => {
    const response = await api.delete(`/paymentMethod/${id}`);
    return response.data;
  },

  // Toggle payment method status
  togglePaymentMethodStatus: async (id) => {
    const response = await api.patch(`/paymentMethod/${id}/toggle`);
    return response.data;
  },
}; 