import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/index';

const usePaymentStatus = (orderId, initialStatus = 'pending') => {
  const [paymentStatus, setPaymentStatus] = useState(initialStatus);
  const [orderStatus, setOrderStatus] = useState('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  
  const pollingIntervalRef = useRef(null);
  const isPollingRef = useRef(false);

  // Check payment status
  const checkPaymentStatus = useCallback(async () => {
    if (!orderId || isPollingRef.current) return;
    
    isPollingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/payment/status/${orderId}`);
      const { order, campayStatus, updated } = response.data;
      
      setPaymentStatus(order.paymentStatus);
      setOrderStatus(order.status);
      setLastChecked(new Date());
      
      // If order was updated via status check, log it
      if (updated) {
        console.log('Order status updated via polling:', order.paymentStatus);
      }
      
      // Stop polling if payment is completed (paid or failed)
      if (order.paymentStatus === 'paid' || order.paymentStatus === 'failed') {
        stopPolling();
      }
      
      return order.paymentStatus;
    } catch (err) {
      console.error('Error checking payment status:', err);
      setError(err.message || 'Failed to check payment status');
      return null;
    } finally {
      setIsLoading(false);
      isPollingRef.current = false;
    }
  }, [orderId]);

  // Start polling
  const startPolling = useCallback((intervalMs = 5000) => {
    if (pollingIntervalRef.current) {
      stopPolling();
    }
    
    // Check immediately
    checkPaymentStatus();
    
    // Then set up interval
    pollingIntervalRef.current = setInterval(() => {
      checkPaymentStatus();
    }, intervalMs);
    
    console.log(`Started polling payment status for order ${orderId} every ${intervalMs}ms`);
  }, [orderId, checkPaymentStatus]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      console.log(`Stopped polling payment status for order ${orderId}`);
    }
  }, [orderId]);

  // Manual refresh
  const refreshStatus = useCallback(() => {
    return checkPaymentStatus();
  }, [checkPaymentStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Auto-start polling for pending payments
  useEffect(() => {
    if (orderId && paymentStatus === 'pending') {
      startPolling(5000); // Check every 5 seconds
    }
  }, [orderId, paymentStatus, startPolling]);

  return {
    paymentStatus,
    orderStatus,
    isLoading,
    error,
    lastChecked,
    checkPaymentStatus: refreshStatus,
    startPolling,
    stopPolling,
    isPolling: !!pollingIntervalRef.current
  };
};

export default usePaymentStatus; 