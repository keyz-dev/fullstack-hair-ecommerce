import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../api';
import { paymentApi } from '../api/payment';


const usePaymentTracker = () => {
  const socketRef = useRef(null);
  const pollingRefs = useRef(new Map()); // Map of paymentReference -> interval
  const [isConnected, setIsConnected] = useState(false);
  const [paymentStatuses, setPaymentStatuses] = useState({});
  const [trackedPayments, setTrackedPayments] = useState(new Set());

  // Initialize socket connection
  useEffect(() => {
    // Remove /v2/api from the URL for Socket.IO connection
    const backendUrl = API_BASE_URL.replace('/v2/api', '');
    
    socketRef.current = io(backendUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    // Connection event handlers
    socketRef.current.on('connect', () => {
      console.log('🔌 Connected to payment socket');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('🔌 Disconnected from payment socket');
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error);
      setIsConnected(false);
    });

    // Payment event handlers - these come from webhook updates
    socketRef.current.on('payment-initiated', (data) => {
      console.log('💳 Payment initiated via webhook:', data);
      updatePaymentStatus(data.reference, {
        status: 'PENDING',
        message: 'Payment request sent. Please check your phone.',
        timestamp: data.timestamp,
        source: 'webhook'
      });
      
      toast.info('Payment request sent. Please check your phone for the payment prompt.', {
        autoClose: 5000
      });
    });

    socketRef.current.on('payment-success', (data) => {
      console.log('✅ Payment successful via webhook:', data);
      updatePaymentStatus(data.reference, {
        status: 'SUCCESSFUL',
        message: 'Payment completed successfully!',
        timestamp: data.timestamp,
        source: 'webhook',
        ...data
      });
      
      // Stop polling for this payment
      stopPolling(data.reference);
      
      toast.success('Payment completed successfully!', {
        autoClose: 5000
      });
    });

    socketRef.current.on('payment-failed', (data) => {
      console.log('❌ Payment failed via webhook:', data);
      updatePaymentStatus(data.reference, {
        status: 'FAILED',
        message: 'Payment failed or was cancelled.',
        timestamp: data.timestamp,
        source: 'webhook',
        ...data
      });
      
      // Stop polling for this payment
      stopPolling(data.reference);
      
      toast.error('Payment failed or was cancelled.', {
        autoClose: 5000
      });
    });

    socketRef.current.on('payment-cancelled', (data) => {
      console.log('❌ Payment cancelled via webhook:', data);
      updatePaymentStatus(data.reference, {
        status: 'CANCELLED',
        message: 'Payment was cancelled.',
        timestamp: data.timestamp,
        source: 'webhook',
        ...data
      });
      
      // Stop polling for this payment
      stopPolling(data.reference);
      
      toast.warning('Payment was cancelled.', {
        autoClose: 5000
      });
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      // Clear all polling intervals
      pollingRefs.current.forEach((interval) => clearInterval(interval));
      pollingRefs.current.clear();
    };
  }, []);

  // Update payment status helper
  const updatePaymentStatus = useCallback((reference, statusData) => {
    setPaymentStatuses(prev => ({
      ...prev,
      [reference]: {
        ...prev[reference],
        ...statusData
      }
    }));
  }, []);

  // Stop polling for a payment
  const stopPolling = useCallback((paymentReference) => {
    const interval = pollingRefs.current.get(paymentReference);
    if (interval) {
      clearInterval(interval);
      pollingRefs.current.delete(paymentReference);
      console.log(`🛑 Stopped polling for ${paymentReference}`);
    }
  }, []);

  // Poll payment status from API (fallback when socket fails)
  const pollPaymentStatus = useCallback(async (paymentReference, orderId) => {
    try {
      const response = await paymentApi.getPaymentStatus(orderId);
      const { order, campayStatus } = response;
      
      const status = order.paymentStatus.toUpperCase();
      const message = status === 'PAID' ? 'Payment completed successfully!' : 
                     status === 'FAILED' ? 'Payment failed or was cancelled.' :
                     'Payment is being processed...';
      
      updatePaymentStatus(paymentReference, {
        status,
        message,
        timestamp: new Date(),
        source: 'polling',
        orderStatus: order.status,
        campayStatus
      });

      // Stop polling if payment is completed
      if (status === 'PAID' || status === 'FAILED' || status === 'CANCELLED') {
        stopPolling(paymentReference);
        console.log(`🛑 Stopped polling for ${paymentReference} - payment ${status}`);
      }
      
    } catch (error) {
      console.error('Polling error for', paymentReference, ':', error);
    }
  }, [updatePaymentStatus, stopPolling]);

  // Start polling for a payment
  const startPolling = useCallback((paymentReference, orderId, intervalMs = 10000) => {
    // Stop existing polling if any
    stopPolling(paymentReference);
    
    // Poll immediately
    pollPaymentStatus(paymentReference, orderId);
    
    // Set up interval
    const interval = setInterval(() => {
      pollPaymentStatus(paymentReference, orderId);
    }, intervalMs);
    
    pollingRefs.current.set(paymentReference, interval);
    console.log(`🔄 Started polling for ${paymentReference} every ${intervalMs}ms`);
  }, [pollPaymentStatus, stopPolling]);

  // Track a payment (combines socket tracking + polling fallback)
  const trackPayment = useCallback((paymentReference, orderId, userId = null) => {
    if (trackedPayments.has(paymentReference)) {
      console.log(`Already tracking ${paymentReference}`);
      return true;
    }

    console.log(`👤 Starting to track payment: ${paymentReference}`);
    
    // Add to tracked payments
    setTrackedPayments(prev => new Set([...prev, paymentReference]));
    
    // Initialize status
    updatePaymentStatus(paymentReference, {
      status: 'PENDING',
      message: 'Payment tracking started...',
      timestamp: new Date(),
      source: 'init'
    });

    // Try socket tracking first
    if (socketRef.current && isConnected) {
      socketRef.current.emit('track-payment', {
        paymentReference,
        userId
      });
      console.log(`🔌 Socket tracking enabled for ${paymentReference}`);
    } else {
      console.log(`🔌 Socket not available, using polling for ${paymentReference}`);
    }

    // Always start polling as fallback
    startPolling(paymentReference, orderId);
    
    return true;
  }, [isConnected, trackedPayments, updatePaymentStatus, startPolling]);

  // Stop tracking a payment
  const stopTrackingPayment = useCallback((paymentReference) => {
    console.log(`🛑 Stopping tracking for payment: ${paymentReference}`);
    
    // Stop socket tracking
    if (socketRef.current && isConnected) {
      socketRef.current.emit('stop-tracking-payment', {
        paymentReference
      });
    }

    // Stop polling
    stopPolling(paymentReference);

    // Remove from tracked payments
    setTrackedPayments(prev => {
      const newSet = new Set(prev);
      newSet.delete(paymentReference);
      return newSet;
    });

    // Remove from status
    setPaymentStatuses(prev => {
      const newStatus = { ...prev };
      delete newStatus[paymentReference];
      return newStatus;
    });

    return true;
  }, [isConnected, stopPolling]);

  // Get status for a specific payment
  const getPaymentStatus = useCallback((paymentReference) => {
    return paymentStatuses[paymentReference] || null;
  }, [paymentStatuses]);

  // Check if a payment is being tracked
  const isTrackingPayment = useCallback((paymentReference) => {
    return trackedPayments.has(paymentReference);
  }, [trackedPayments]);

  // Manual check payment status
  const checkPaymentStatus = useCallback(async (orderId) => {
    try {
      const response = await paymentApi.getPaymentStatus(orderId);
      return response;
    } catch (error) {
      console.error('Manual payment status check failed:', error);
      throw error;
    }
  }, []);

  // Clear all tracked payments
  const clearAllPayments = useCallback(() => {
    trackedPayments.forEach(paymentReference => {
      stopTrackingPayment(paymentReference);
    });
  }, [trackedPayments, stopTrackingPayment]);

  return {
    // Connection state
    isConnected,
    
    // Payment tracking
    trackPayment,
    stopTrackingPayment,
    isTrackingPayment,
    clearAllPayments,
    
    // Payment status
    paymentStatuses,
    getPaymentStatus,
    
    // Manual operations
    checkPaymentStatus,
    
    // Debug info
    trackedPayments: Array.from(trackedPayments),
    pollingCount: pollingRefs.current.size
  };
};

export default usePaymentTracker; 