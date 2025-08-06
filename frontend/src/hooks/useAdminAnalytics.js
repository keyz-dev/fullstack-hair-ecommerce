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
  const [partialLoading, setPartialLoading] = useState({
    overview: false,
    revenue: false,
    users: false,
    products: false
  });
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

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
      setIsInitialized(true);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch analytics';
      setError(errorMessage);
      toast.error(`Failed to load dashboard data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  // Fetch data-dependent components when date range changes
  const fetchDataDependentComponents = useCallback(async () => {
    if (!isInitialized) return; // Don't update if not initialized yet
    
    setPartialLoading({
      overview: true,
      revenue: true,
      users: true,
      products: true
    });

    try {
      const [overview, revenue, users, products] = await Promise.all([
        adminAnalyticsApi.getAdminOverview(dateRange),
        adminAnalyticsApi.getRevenueAnalytics(dateRange),
        adminAnalyticsApi.getUserAnalytics(dateRange),
        adminAnalyticsApi.getProductAnalytics(dateRange)
      ]);

      setAnalytics(prev => ({
        ...prev,
        overview: overview.data,
        revenue: revenue.data,
        users: users.data,
        products: products.data
      }));
    } catch (err) {
      console.error('Partial analytics fetch error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update data';
      toast.error(`Failed to update dashboard data: ${errorMessage}`);
    } finally {
      setPartialLoading({
        overview: false,
        revenue: false,
        users: false,
        products: false
      });
    }
  }, [dateRange, isInitialized]);

  // Initial load
  useEffect(() => {
    fetchAnalytics();
  }, []); // Only fetch on mount

  // Handle date range changes with partial updates
  useEffect(() => {
    if (isInitialized) {
      fetchDataDependentComponents();
    }
  }, [dateRange, fetchDataDependentComponents]);

  const refreshAnalytics = () => {
    fetchAnalytics();
  };

  return {
    analytics,
    loading,
    partialLoading,
    error,
    refreshAnalytics
  };
}; 