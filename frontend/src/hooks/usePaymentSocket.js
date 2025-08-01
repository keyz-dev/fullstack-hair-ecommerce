import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../api';

const usePaymentSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [trackedPayments, setTrackedPayments] = useState(new Set());

  // Initialize socket connection
  useEffect(() => {
    const backendUrl = API_BASE_URL;
    
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

    // Payment event handlers
    socketRef.current.on('payment-initiated', (data) => {
      console.log('💳 Payment initiated:', data);
      setPaymentStatus(prev => ({
        ...prev,
        [data.reference]: {
          status: 'PENDING',
          message: 'Payment request sent. Please check your phone.',
          timestamp: data.timestamp
        }
      }));
      
      toast.info('Payment request sent. Please check your phone for the payment prompt.', {
        autoClose: 5000
      });
    });

    socketRef.current.on('payment-status', (data) => {
      console.log('📊 Payment status update:', data);
      setPaymentStatus(prev => ({
        ...prev,
        [data.reference]: {
          status: data.status,
          message: data.message,
          timestamp: data.timestamp,
          ...data
        }
      }));
    });

    socketRef.current.on('payment-success', (data) => {
      console.log('✅ Payment successful:', data);
      setPaymentStatus(prev => ({
        ...prev,
        [data.reference]: {
          status: 'SUCCESSFUL',
          message: 'Payment completed successfully!',
          timestamp: data.timestamp,
          ...data
        }
      }));
      
      toast.success('Payment completed successfully!', {
        autoClose: 5000
      });
    });

    socketRef.current.on('payment-failed', (data) => {
      console.log('❌ Payment failed:', data);
      setPaymentStatus(prev => ({
        ...prev,
        [data.reference]: {
          status: 'FAILED',
          message: 'Payment failed or was cancelled.',
          timestamp: data.timestamp,
          ...data
        }
      }));
      
      toast.error('Payment failed or was cancelled.', {
        autoClose: 5000
      });
    });

    socketRef.current.on('payment-completed', (data) => {
      console.log('🏁 Payment completed:', data);
      setPaymentStatus(prev => ({
        ...prev,
        [data.reference]: {
          status: data.status,
          message: data.success ? 'Payment completed successfully!' : 'Payment failed or was cancelled.',
          timestamp: data.timestamp,
          success: data.success,
          ...data
        }
      }));
    });

    socketRef.current.on('payment-cancelled', (data) => {
      console.log('❌ Payment cancelled:', data);
      setPaymentStatus(prev => ({
        ...prev,
        [data.reference]: {
          status: 'CANCELLED',
          message: 'Payment was cancelled.',
          timestamp: data.timestamp,
          ...data
        }
      }));
      
      toast.warning('Payment was cancelled.', {
        autoClose: 5000
      });
    });

    socketRef.current.on('payment-polling-stopped', (data) => {
      console.log('🛑 Payment polling stopped:', data);
      // This event indicates that the backend has received a final status
      // and the frontend should stop polling for this payment
      setPaymentStatus(prev => ({
        ...prev,
        [data.reference]: {
          ...prev[data.reference],
          pollingStopped: true,
          pollingStoppedReason: data.reason,
          pollingStoppedAt: data.timestamp
        }
      }));
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Track a payment for real-time updates
  const trackPayment = useCallback((paymentReference, userId = null) => {
    if (!socketRef.current || !isConnected) {
      console.warn('Socket not connected, cannot track payment');
      return false;
    }

    console.log(`👤 Tracking payment: ${paymentReference}`);
    
    socketRef.current.emit('track-payment', {
      paymentReference,
      userId
    });

    setTrackedPayments(prev => new Set([...prev, paymentReference]));
    return true;
  }, [isConnected]);

  // Stop tracking a payment
  const stopTrackingPayment = useCallback((paymentReference) => {
    if (!socketRef.current || !isConnected) {
      return false;
    }

    console.log(`🛑 Stopping tracking for payment: ${paymentReference}`);
    
    socketRef.current.emit('stop-tracking-payment', {
      paymentReference
    });

    setTrackedPayments(prev => {
      const newSet = new Set(prev);
      newSet.delete(paymentReference);
      return newSet;
    });

    // Remove from payment status
    setPaymentStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[paymentReference];
      return newStatus;
    });

    return true;
  }, [isConnected]);

  // Get status for a specific payment
  const getPaymentStatus = useCallback((paymentReference) => {
    return paymentStatus?.[paymentReference] || null;
  }, [paymentStatus]);

  // Check if a payment is being tracked
  const isTrackingPayment = useCallback((paymentReference) => {
    return trackedPayments.has(paymentReference);
  }, [trackedPayments]);

  // Get all tracked payments
  const getTrackedPayments = useCallback(() => {
    return Array.from(trackedPayments);
  }, [trackedPayments]);

  // Clear all tracked payments
  const clearTrackedPayments = useCallback(() => {
    trackedPayments.forEach(paymentReference => {
      stopTrackingPayment(paymentReference);
    });
    setTrackedPayments(new Set());
    setPaymentStatus({});
  }, [trackedPayments, stopTrackingPayment]);

  return {
    // Connection state
    isConnected,
    
    // Payment tracking
    trackPayment,
    stopTrackingPayment,
    isTrackingPayment,
    getTrackedPayments,
    clearTrackedPayments,
    
    // Payment status
    paymentStatus,
    getPaymentStatus,
    
    // Socket instance (for advanced usage)
    socket: socketRef.current
  };
};

export default usePaymentSocket; 