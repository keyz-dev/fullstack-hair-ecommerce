import api from './index';

export const adminAnalyticsApi = {
  // Get admin dashboard overview
  getAdminOverview: async (dateRange = '30d') => {
    try {
      const response = await api.get(`/adminAnalytics/overview?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('getAdminOverview error:', error);
      throw error;
    }
  },

  // Get sales analytics
  getSalesAnalytics: async (dateRange = '30d') => {
    try {
      const response = await api.get(`/adminAnalytics/sales?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('getSalesAnalytics error:', error);
      throw error;
    }
  },

  // Get user analytics
  getUserAnalytics: async (dateRange = '30d') => {
    try {
      const response = await api.get(`/adminAnalytics/users?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('getUserAnalytics error:', error);
      throw error;
    }
  },

  // Get product analytics
  getProductAnalytics: async (dateRange = '30d') => {
    try {
      const response = await api.get(`/adminAnalytics/products?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('getProductAnalytics error:', error);
      throw error;
    }
  },

  // Get order analytics
  getOrderAnalytics: async (dateRange = '30d') => {
    try {
      const response = await api.get(`/adminAnalytics/orders?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('getOrderAnalytics error:', error);
      throw error;
    }
  },

  // Get booking analytics
  getBookingAnalytics: async (dateRange = '30d') => {
    try {
      const response = await api.get(`/adminAnalytics/bookings?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('getBookingAnalytics error:', error);
      throw error;
    }
  },

  // Get revenue analytics
  getRevenueAnalytics: async (dateRange = '30d') => {
    try {
      const response = await api.get(`/adminAnalytics/revenue?range=${dateRange}`);
      return response.data;
    } catch (error) {
      console.error('getRevenueAnalytics error:', error);
      throw error;
    }
  },

  // Get activity timeline
  getActivityTimeline: async (limit = 10) => {
    try {
      const response = await api.get(`/adminAnalytics/activity?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('getActivityTimeline error:', error);
      throw error;
    }
  }
}; 