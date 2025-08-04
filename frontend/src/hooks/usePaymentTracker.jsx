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
  const [trackedPaymentUsers, setTrackedPaymentUsers] = useState(new Map()); // paymentReference -> userId
  const [trackedPaymentSessions, setTrackedPaymentSessions] = useState(new Map()); // paymentReference -> sessionId
  const [completedPayments, setCompletedPayments] = useState(new Set()); // Track completed payments to prevent double stops

  // Initialize socket connection
  useEffect(() => {
    // Only initialize socket if we have tracked payments or expect to have them
    if (trackedPayments.size === 0) {
      console.log('No payments to track, skipping socket initialization');
      return;
    }

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
      
      // Rejoin payment rooms for tracked payments after reconnection
      trackedPayments.forEach(paymentReference => {
        const userId = trackedPaymentUsers.get(paymentReference);
        const sessionId = trackedPaymentSessions.get(paymentReference);
        
        if (userId || sessionId) {
          socketRef.current.emit('track-payment', {
            paymentReference,
            userId,
            sessionId
          });
          console.log(`🔄 Rejoined payment room for ${paymentReference} after reconnection`);
        }
      });
    });

    socketRef.current.on('disconnect', () => {
      console.log('🔌 Disconnected from payment socket');
      setIsConnected(false);
    });

    socketRef.current.on('reconnect', () => {
      console.log('🔌 Reconnected to payment socket');
      setIsConnected(true);
      
      // Rejoin all payment rooms after reconnection
      trackedPayments.forEach(paymentReference => {
        const userId = trackedPaymentUsers.get(paymentReference);
        const sessionId = trackedPaymentSessions.get(paymentReference);
        
        if ((userId || sessionId) && socketRef.current) {
          socketRef.current.emit('track-payment', {
            paymentReference,
            userId,
            sessionId
          });
          console.log(`🔄 Rejoined payment room for ${paymentReference} after reconnection`);
        }
      });
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

    socketRef.current.on('payment-status-update', (data) => {
      console.log('Payment status updated via webhook the:', data);
      // updatePaymentStatus(data.reference, {
      //   status: data.status,
      //   message: data.message,
      //   timestamp: data.timestamp,
      //   source: 'webhook',
      //   ...data
      // });
    });

    socketRef.current.on('payment-success', (data) => {
      console.log('✅ Payment successful via webhook:', data);
      
      // Check if payment was already completed to prevent double processing
      if (completedPayments.has(data.reference)) {
        console.log(`🛑 Payment ${data.reference} already completed, skipping duplicate event`);
        return;
      }
      
      updatePaymentStatus(data.reference, {
        status: 'SUCCESSFUL',
        message: 'Payment completed successfully!',
        timestamp: data.timestamp,
        source: 'webhook',
        ...data
      });
      
      // Mark as completed and stop polling
      setCompletedPayments(prev => new Set([...prev, data.reference]));
      stopPolling(data.reference);
      
      // Show toast with clickable link to order summary
      const toastId = toast.success(
        <div>
          <div>Payment completed successfully!</div>
          <button 
            onClick={() => {
              // Navigate to order summary page
              window.location.href = `/order-confirmation?orderId=${data.orderId || 'unknown'}`;
              toast.dismiss(toastId);
            }}
            className="text-sm underline mt-1 hover:no-underline"
          >
            View Order Summary
          </button>
        </div>,
        {
          autoClose: 8000,
          closeOnClick: false,
          pauseOnHover: true
        }
      );
    });

    socketRef.current.on('payment-failed', (data) => {
      console.log('❌ Payment failed via webhook:', data);
      
      // Check if payment was already completed to prevent double processing
      if (completedPayments.has(data.reference)) {
        console.log(`🛑 Payment ${data.reference} already completed, skipping duplicate event`);
        return;
      }
      
      updatePaymentStatus(data.reference, {
        status: 'FAILED',
        message: 'Payment failed or was cancelled.',
        timestamp: data.timestamp,
        source: 'webhook',
        ...data
      });
      
      // Mark as completed and stop polling
      setCompletedPayments(prev => new Set([...prev, data.reference]));
      stopPolling(data.reference);
      
      toast.error('Payment failed or was cancelled.', {
        autoClose: 5000
      });
    });

    socketRef.current.on('payment-cancelled', (data) => {
      console.log('❌ Payment cancelled via webhook:', data);
      
      // Check if payment was already completed to prevent double processing
      if (completedPayments.has(data.reference)) {
        console.log(`🛑 Payment ${data.reference} already completed, skipping duplicate event`);
        return;
      }
      
      updatePaymentStatus(data.reference, {
        status: 'CANCELLED',
        message: 'Payment was cancelled.',
        timestamp: data.timestamp,
        source: 'webhook',
        ...data
      });
      
      // Mark as completed and stop polling
      setCompletedPayments(prev => new Set([...prev, data.reference]));
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
  }, [trackedPayments.size]); // Add trackedPayments.size as dependency

  // Cleanup socket when no payments are being tracked
  useEffect(() => {
    if (trackedPayments.size === 0 && socketRef.current && isConnected) {
      console.log('No payments to track, disconnecting socket');
      socketRef.current.disconnect();
      setIsConnected(false);
    }
  }, [trackedPayments.size, isConnected]);

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

      // Stop polling if payment is completed (but only if not already completed)
      if ((status === 'PAID' || status === 'FAILED' || status === 'CANCELLED') && 
          !completedPayments.has(paymentReference)) {
        setCompletedPayments(prev => new Set([...prev, paymentReference]));
        stopPolling(paymentReference);
        console.log(`🛑 Stopped polling for ${paymentReference} - payment ${status}`);
        
        // Show toast for completed payment
        if (status === 'PAID') {
          const toastId = toast.success(
            <div>
              <div>Payment completed successfully!</div>
              <button 
                onClick={() => {
                  window.location.href = `/order-confirmation?orderId=${orderId}`;
                  toast.dismiss(toastId);
                }}
                className="text-sm underline mt-1 hover:no-underline"
              >
                View Order Summary
              </button>
            </div>,
            {
              autoClose: 8000,
              closeOnClick: false,
              pauseOnHover: true
            }
          );
        } else if (status === 'FAILED' || status === 'CANCELLED') {
          toast.error('Payment failed or was cancelled.', {
            autoClose: 5000
          });
        }
      }
      
    } catch (error) {
      console.error('Polling error for', paymentReference, ':', error);
    }
  }, [updatePaymentStatus, stopPolling, completedPayments]);

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
  const trackPayment = useCallback((paymentReference, orderId, userId = null, sessionId = null) => {
    if (trackedPayments.has(paymentReference)) {
      console.log(`Already tracking ${paymentReference}`);
      return true;
    }

    console.log(`👤 Starting to track payment: ${paymentReference}`);
    
    // Add to tracked payments
    setTrackedPayments(prev => new Set([...prev, paymentReference]));
    
    // Store userId for this payment
    if (userId) {
      setTrackedPaymentUsers(prev => new Map(prev).set(paymentReference, userId));
    }
    
    // Store sessionId for non-authenticated users
    if (sessionId) {
      setTrackedPaymentSessions(prev => new Map(prev).set(paymentReference, sessionId));
    }
    
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
        userId,
        sessionId
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
      const storedUserId = trackedPaymentUsers.get(paymentReference);
      const storedSessionId = trackedPaymentSessions.get(paymentReference);
      socketRef.current.emit('stop-tracking-payment', {
        paymentReference,
        userId: storedUserId,
        sessionId: storedSessionId
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

    // Remove from tracked payment users
    setTrackedPaymentUsers(prev => {
      const newMap = new Map(prev);
      newMap.delete(paymentReference);
      return newMap;
    });

    // Remove from tracked payment sessions
    setTrackedPaymentSessions(prev => {
      const newMap = new Map(prev);
      newMap.delete(paymentReference);
      return newMap;
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