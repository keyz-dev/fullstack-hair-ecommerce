import api from './index';

export const paymentApi = {
  // Initiate payment for an order - matches POST /payment/initiate in backend
  initiatePayment: async (paymentData) => {
    const response = await api.post('/payment/initiate', paymentData);
    return response.data;
  },

  // Check payment status - matches GET /payment/check/:orderId in backend
  checkPaymentStatus: async (orderId) => {
    const response = await api.get(`/payment/check/${orderId}`);
    return response.data;
  },

  // Get payment status by order ID - matches GET /payment/status/:orderId in backend
  getPaymentStatus: async (orderId) => {
    const response = await api.get(`/payment/status/${orderId}`);
    return response.data;
  },

  // Debug endpoint - matches GET /payment/debug in backend
  getDebugInfo: async () => {
    const response = await api.get('/payment/debug');
    return response.data;
  },

  // Simulate payment flow (development only) - matches POST /payment/simulate in backend
  simulatePaymentFlow: async (simulationData) => {
    const response = await api.post('/payment/simulate', simulationData);
    return response.data;
  }
};

// Export individual functions for easier imports
export const { 
  initiatePayment, 
  checkPaymentStatus, 
  getPaymentStatus, 
  getDebugInfo, 
  simulatePaymentFlow 
} = paymentApi; 