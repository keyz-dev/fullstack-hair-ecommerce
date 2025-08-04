import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../api/analytics';
import { toast } from 'react-toastify';

export const useClientAnalytics = (dateRange = '30d') => {
  const [analytics, setAnalytics] = useState({
    overview: null,
    orders: null,
    bookings: null,
    spending: null,
    activity: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [overview, orders, bookings, spending, activity] = await Promise.all([
        analyticsApi.getClientAnalytics(dateRange),
        analyticsApi.getOrderAnalytics(dateRange),
        analyticsApi.getBookingAnalytics(dateRange),
        analyticsApi.getSpendingAnalytics(dateRange),
        analyticsApi.getActivityTimeline()
      ]);

      setAnalytics({
        overview: overview.data,
        orders: orders.data,
        bookings: bookings.data,
        spending: spending.data,
        activity: activity.data
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics');
      toast.error('Failed to load dashboard data');
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