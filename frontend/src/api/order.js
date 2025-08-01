
import api from './index';

export const orderApi = {
  // Create new order - matches POST /order in backend
  createOrder: async (orderData) => {
    const response = await api.post('/order', orderData);
    return response.data;
  },

  // Get user's orders - matches GET /order/my in backend
  getMyOrders: async () => {
    const response = await api.get('/order/my');
    return response.data;
  },

  // Get single order by ID - matches GET /order/:id in backend
  getOrderById: async (orderId) => {
    const response = await api.get(`/order/${orderId}`);
    return response.data;
  },

  // Admin: Get all orders - matches GET /order/admin/all in backend
  getAllOrdersAdmin: async () => {
    const response = await api.get('/order/admin/all');
    return response.data;
  }
};
