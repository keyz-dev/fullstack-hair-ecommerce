import { useState, useEffect, useCallback } from 'react';
import { adminAnalyticsApi } from '../api/adminAnalytics';
import { toast } from 'react-toastify';

export const useAdminAnalytics = (dateRange = '30d') => {
  const [analytics, setAnalytics] = useState({
    overview: null,
    sales: null,
    users: null,
    products: null,
    orders: null,
    bookings: null,
    revenue: null,
    activity: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [overview, sales, users, products, orders, bookings, revenue, activity] = await Promise.all([
        adminAnalyticsApi.getAdminOverview(dateRange),
        adminAnalyticsApi.getSalesAnalytics(dateRange),
        adminAnalyticsApi.getUserAnalytics(dateRange),
        adminAnalyticsApi.getProductAnalytics(dateRange),
        adminAnalyticsApi.getOrderAnalytics(dateRange),
        adminAnalyticsApi.getBookingAnalytics(dateRange),
        adminAnalyticsApi.getRevenueAnalytics(dateRange),
        adminAnalyticsApi.getActivityTimeline()
      ]);

      setAnalytics({
        overview: overview.data,
        sales: sales.data,
        users: users.data,
        products: products.data,
        orders: orders.data,
        bookings: bookings.data,
        revenue: revenue.data,
        activity: activity.data
      });
    } catch (err) {
      console.error('Analytics fetch error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch analytics';
      setError(errorMessage);
      toast.error(`Failed to load dashboard data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const refreshAnalytics = () => {
    fetchAnalytics();
  };

  return {
    analytics,
    loading,
    error,
    refreshAnalytics
  };
}; 