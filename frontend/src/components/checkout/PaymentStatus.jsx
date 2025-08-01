import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { usePaymentStatus } from '../../hooks';

const PaymentStatus = ({ orderId, initialStatus = 'pending' }) => {
  const {
    paymentStatus,
    isLoading,
    error,
    lastChecked,
    checkPaymentStatus,
    isPolling
  } = usePaymentStatus(orderId, initialStatus);

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'paid':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'paid':
        return 'Payment Successful';
      case 'failed':
        return 'Payment Failed';
      case 'pending':
        return 'Payment Pending';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusDescription = () => {
    switch (paymentStatus) {
      case 'paid':
        return 'Your payment has been confirmed. Your order is being processed.';
      case 'failed':
        return 'Payment was not successful. Please try again or contact support.';
      case 'pending':
        return 'Please check your phone and confirm the payment prompt.';
      default:
        return 'Checking payment status...';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'paid':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'failed':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold">{getStatusText()}</h3>
            <p className="text-sm opacity-80">{getStatusDescription()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isPolling && (
            <div className="flex items-center gap-1 text-xs opacity-70">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Auto-refreshing</span>
            </div>
          )}
          
          <button
            onClick={checkPaymentStatus}
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-white bg-opacity-50 hover:bg-opacity-70 rounded border transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Checking...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {lastChecked && (
        <div className="mt-2 text-xs opacity-60">
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}

      {paymentStatus === 'pending' && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-medium text-blue-800 mb-2">What to do next:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Check your phone for the payment prompt</li>
            <li>• Enter your PIN to confirm the payment</li>
            <li>• This page will automatically update when payment is confirmed</li>
            <li>• If you don't receive a prompt, try refreshing or contact support</li>
          </ul>
        </div>
      )}

      {paymentStatus === 'paid' && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
          <h4 className="font-medium text-green-800 mb-2">Payment Confirmed!</h4>
          <p className="text-sm text-green-700">
            Your order is now being processed. You will receive an email confirmation shortly.
          </p>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
          <h4 className="font-medium text-red-800 mb-2">Payment Failed</h4>
          <p className="text-sm text-red-700 mb-2">
            The payment was not successful. This could be due to:
          </p>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Insufficient funds in your account</li>
            <li>• Incorrect PIN entered</li>
            <li>• Payment was cancelled</li>
            <li>• Network issues</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus; 