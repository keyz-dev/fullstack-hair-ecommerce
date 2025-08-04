import api from './index';

export const analyticsApi = {
  // Get client dashboard analytics
  getClientAnalytics: async (dateRange = '30d') => {
    const response = await api.get(`/analytics/client?range=${dateRange}`);
    return response.data;
  },

  // Get order analytics
  getOrderAnalytics: async (dateRange = '30d') => {
    const response = await api.get(`/analytics/orders?range=${dateRange}`);
    return response.data;
  },

  // Get booking analytics
  getBookingAnalytics: async (dateRange = '30d') => {
    const response = await api.get(`/analytics/bookings?range=${dateRange}`);
    return response.data;
  },

  // Get spending analytics
  getSpendingAnalytics: async (dateRange = '30d') => {
    const response = await api.get(`/analytics/spending?range=${dateRange}`);
    return response.data;
  },

  // Get activity timeline
  getActivityTimeline: async (limit = 10) => {
    const response = await api.get(`/analytics/activity?limit=${limit}`);
    return response.data;
  }
}; 