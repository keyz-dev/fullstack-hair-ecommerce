import React, { useEffect, useState } from 'react';
import { usePaymentSocket } from '../../hooks';
import { CheckCircle, Clock, XCircle, AlertCircle, Phone, RefreshCw } from 'lucide-react';
import { checkPaymentStatus } from '../../api/payment';

const PaymentTracker = ({ paymentReference, orderId, amount, phoneNumber }) => {
  const { trackPayment, getPaymentStatus, isTrackingPayment } = usePaymentSocket();
  const [status, setStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  // Start tracking payment when component mounts
  useEffect(() => {
    if (paymentReference && !isTrackingPayment(paymentReference)) {
      trackPayment(paymentReference);
    }
  }, [paymentReference, trackPayment, isTrackingPayment]);

  // Get payment status updates
  useEffect(() => {
    if (paymentReference) {
      const paymentStatus = getPaymentStatus(paymentReference);
      if (paymentStatus) {
        setStatus(paymentStatus);
      }
    }
  }, [paymentReference, getPaymentStatus]);

  // Frontend polling for payment status updates (fallback)
  useEffect(() => {
    if (!paymentReference) return;

    const interval = setInterval(async () => {
      // Only poll if payment is still pending
      if (status?.status === 'PENDING' || !status) {
        try {
          const response = await checkPaymentStatus(orderId);
          if (response.success) {
            setStatus({
              status: response.order.paymentStatus.toUpperCase(),
              message: `Payment ${response.order.paymentStatus}`,
              timestamp: new Date(),
              shouldStopPolling: response.shouldStopPolling
            });
            
            // Stop polling if payment is completed
            if (response.shouldStopPolling) {
              console.log('🛑 Stopping polling - payment completed');
              clearInterval(interval);
            }
          }
        } catch (error) {
          console.error('Polling check failed:', error);
        }
      } else {
        // Stop polling if payment is no longer pending
        console.log('🛑 Stopping polling - payment no longer pending');
        clearInterval(interval);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [paymentReference, orderId, status?.status]);

  // Manual check payment status
  const handleManualCheck = async () => {
    if (!orderId || isChecking) return;
    
    setIsChecking(true);
    try {
      const response = await checkPaymentStatus(orderId);
      if (response.success) {
        // Update local status
        setStatus({
          status: response.order.paymentStatus.toUpperCase(),
          message: `Payment ${response.order.paymentStatus}`,
          timestamp: new Date(),
          shouldStopPolling: response.shouldStopPolling
        });
        
        if (response.shouldStopPolling) {
          console.log('🛑 Manual check indicates polling should stop');
        }
      }
    } catch (error) {
      console.error('Manual check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  if (!paymentReference) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
          <span className="text-yellow-800">No payment reference available</span>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (status?.status) {
      case 'SUCCESSFUL':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'FAILED':
      case 'CANCELLED':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'PENDING':
      default:
        return <Clock className="w-6 h-6 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status?.status) {
      case 'SUCCESSFUL':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'PENDING':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getStatusMessage = () => {
    if (!status) {
      return 'Initializing payment tracking...';
    }

    switch (status.status) {
      case 'SUCCESSFUL':
        return 'Payment completed successfully!';
      case 'FAILED':
        return 'Payment failed or was cancelled.';
      case 'CANCELLED':
        return 'Payment was cancelled.';
      case 'PENDING':
        return 'Payment request sent. Please check your phone for the payment prompt.';
      default:
        return status.message || 'Processing payment...';
    }
  };

  return (
    <div className={`border rounded-lg p-6 ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          {getStatusIcon()}
          <h3 className="text-lg font-semibold ml-2">Payment Status</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm opacity-75">
            {status?.timestamp && new Date(status.timestamp).toLocaleTimeString()}
          </div>
          {orderId && status?.status !== 'SUCCESSFUL' && status?.status !== 'FAILED' && status?.status !== 'CANCELLED' && (
            <button
              onClick={handleManualCheck}
              disabled={isChecking}
              className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Checking...' : 'Check'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Payment Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Reference:</span>
            <p className="font-mono text-xs mt-1">{paymentReference}</p>
          </div>
          <div>
            <span className="font-medium">Amount:</span>
            <p className="mt-1">{amount} XAF</p>
          </div>
          {phoneNumber && (
            <div className="col-span-2">
              <span className="font-medium">Phone Number:</span>
              <div className="flex items-center mt-1">
                <Phone className="w-4 h-4 mr-1" />
                <span>{phoneNumber}</span>
              </div>
            </div>
          )}
        </div>

        {/* Status Message */}
        <div className="bg-white/50 rounded-md p-3">
          <p className="font-medium">{getStatusMessage()}</p>
          {status?.operator && (
            <p className="text-sm mt-1 opacity-75">
              Operator: {status.operator}
            </p>
          )}
        </div>

        {/* Progress Steps */}
        <div className="space-y-2">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full border-2 ${
              status?.status === 'PENDING' || status?.status === 'SUCCESSFUL' || status?.status === 'FAILED'
                ? 'bg-blue-500 border-blue-500'
                : 'border-gray-300'
            }`}></div>
            <span className="ml-2 text-sm">Payment Request Sent</span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full border-2 ${
              status?.status === 'SUCCESSFUL' || status?.status === 'FAILED'
                ? 'bg-blue-500 border-blue-500'
                : 'border-gray-300'
            }`}></div>
            <span className="ml-2 text-sm">Payment Processed</span>
          </div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full border-2 ${
              status?.status === 'SUCCESSFUL'
                ? 'bg-green-500 border-green-500'
                : status?.status === 'FAILED'
                ? 'bg-red-500 border-red-500'
                : 'border-gray-300'
            }`}></div>
            <span className="ml-2 text-sm">Payment Completed</span>
          </div>
        </div>

        {/* Additional Info */}
        {status?.campayCode && (
          <div className="text-xs opacity-75">
            <p>Campay Code: {status.campayCode}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTracker; 