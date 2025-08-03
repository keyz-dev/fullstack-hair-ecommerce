import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Clock, Phone, CreditCard, AlertCircle, Loader2 } from 'lucide-react';

// Socket.IO client setup (you'll need to install socket.io-client)
// import io from 'socket.io-client';

// Mock Socket.IO for demo purposes - replace with actual implementation
const mockSocket = {
  connect: () => console.log('Socket connected'),
  disconnect: () => console.log('Socket disconnected'),
  emit: (event, data) => console.log('Socket emit:', event, data),
  on: (event, callback) => console.log('Socket on:', event),
  off: (event, callback) => console.log('Socket off:', event)
};

const PaymentTracker = () => {
  // Payment form state
  const [formData, setFormData] = useState({
    amount: '',
    phoneNumber: '237',
    description: '',
    userId: ''
  });

  // Payment tracking state
  const [currentPayment, setCurrentPayment] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);

  // Socket connection
  const socketRef = useRef(null);
  const API_BASE_URL = 'http://localhost:5000/api';

  // Initialize socket connection
  useEffect(() => {
    // In real implementation, uncomment this:
    // socketRef.current = io('http://localhost:5000');
    socketRef.current = mockSocket;

    socketRef.current.connect();

    // Listen for payment status updates
    socketRef.current.on('payment-status-update', handleStatusUpdate);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Handle real-time status updates from Socket.IO
  const handleStatusUpdate = (update) => {
    console.log('Received status update:', update);
    
    setPaymentStatus(prev => ({
      ...prev,
      ...update,
      updatedAt: new Date().toISOString()
    }));

    // Add to status history
    setStatusHistory(prev => [
      ...prev,
      {
        status: update.status,
        message: update.message,
        timestamp: new Date().toISOString(),
        data: update
      }
    ]);

    // Stop processing when payment completes
    if (update.status === 'SUCCESSFUL' || update.status === 'FAILED') {
      setIsProcessing(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format phone number input
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Ensure it starts with 237
    if (!value.startsWith('237')) {
      value = '237' + value.replace(/^237/, '');
    }
    
    // Limit to 12 digits (237 + 9 digits)
    if (value.length > 12) {
      value = value.substring(0, 12);
    }
    
    setFormData(prev => ({
      ...prev,
      phoneNumber: value
    }));
  };

  // Validate form data
  const validateForm = () => {
    const { amount, phoneNumber, description } = formData;
    
    if (!amount || !phoneNumber || !description) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!phoneNumber.match(/^237[67]\d{8}$/)) {
      setError('Phone number must be in format 237XXXXXXXXX (MTN or Orange)');
      return false;
    }

    if (!Number.isInteger(Number(amount)) || Number(amount) <= 0) {
      setError('Amount must be a positive whole number');
      return false;
    }

    if (Number(amount) < 100) {
      setError('Minimum amount is 100 XAF');
      return false;
    }

    return true;
  };

  // Initiate payment
  const initiatePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setError(null);
    setStatusHistory([]);

    try {
      const response = await fetch(`${API_BASE_URL}/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        const payment = {
          paymentId: result.paymentId,
          reference: result.reference,
          amount: formData.amount,
          phoneNumber: formData.phoneNumber,
          description: formData.description,
          status: result.status
        };

        setCurrentPayment(payment);
        setPaymentStatus({
          paymentId: result.paymentId,
          status: result.status,
          message: result.message
        });

        // Join payment session for real-time updates
        socketRef.current.emit('join-payment-session', result.paymentId);

        // Add initial status to history
        setStatusHistory([{
          status: result.status,
          message: result.message,
          timestamp: new Date().toISOString(),
          data: result
        }]);

      } else {
        setError(result.error || 'Payment initiation failed');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Payment initiation error:', err);
      setError('Network error. Please check your connection and try again.');
      setIsProcessing(false);
    }
  };

  // Manual status check
  const checkPaymentStatus = async () => {
    if (!currentPayment?.paymentId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/payments/${currentPayment.paymentId}/check-status`, {
        method: 'POST'
      });

      const result = await response.json();
      console.log('Manual status check result:', result);
    } catch (err) {
      console.error('Status check error:', err);
    }
  };

  // Reset form and start new payment
  const startNewPayment = () => {
    if (currentPayment?.paymentId) {
      socketRef.current.emit('leave-payment-session', currentPayment.paymentId);
    }
    
    setCurrentPayment(null);
    setPaymentStatus(null);
    setIsProcessing(false);
    setError(null);
    setStatusHistory([]);
    setFormData({
      amount: '',
      phoneNumber: '237',
      description: '',
      userId: ''
    });
  };

  // Get status icon and color
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'PENDING':
        return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50' };
      case 'SUCCESSFUL':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' };
      case 'FAILED':
        return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' };
      default:
        return { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-50' };
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <CreditCard className="mr-3 text-blue-500" />
            CamPay Payment Tracker
          </h1>

          {!currentPayment ? (
            // Payment Form
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (XAF) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount (minimum 100 XAF)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="237XXXXXXXXX (MTN or Orange)"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Format: 237XXXXXXXXX (must start with 237)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Payment description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID (Optional)
                </label>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  placeholder="Optional user identifier"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-400 mr-2" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <button
                onClick={initiatePayment}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Initiating Payment...
                  </>
                ) : (
                  'Initiate Payment'
                )}
              </button>
            </div>
          ) : (
            // Payment Tracking
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <span className="ml-2 font-semibold">{formatCurrency(currentPayment.amount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 font-semibold">{currentPayment.phoneNumber}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Description:</span>
                    <span className="ml-2">{currentPayment.description}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="ml-2 font-mono text-xs">{currentPayment.paymentId}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Reference:</span>
                    <span className="ml-2 font-mono text-xs">{currentPayment.reference}</span>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              {paymentStatus && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Payment Status</h3>
                    <button
                      onClick={checkPaymentStatus}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Check Status
                    </button>
                  </div>
                  
                  <div className={`flex items-center p-3 rounded-lg ${getStatusDisplay(paymentStatus.status).bg}`}>
                    {React.createElement(getStatusDisplay(paymentStatus.status).icon, {
                      className: `h-6 w-6 mr-3 ${getStatusDisplay(paymentStatus.status).color}`
                    })}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {paymentStatus.status}
                      </p>
                      {paymentStatus.message && (
                        <p className="text-gray-600 text-sm mt-1">
                          {paymentStatus.message}
                        </p>
                      )}
                      {paymentStatus.updatedAt && (
                        <p className="text-gray-500 text-xs mt-1">
                          Last updated: {new Date(paymentStatus.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Processing Animation */}
                  {isProcessing && paymentStatus.status === 'PENDING' && (
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center">
                        <Loader2 className="animate-spin h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          Waiting for payment confirmation...
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Please check your phone for the payment prompt
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Status History */}
              {statusHistory.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Status History</h3>
                  <div className="space-y-3">
                    {statusHistory.map((entry, index) => (
                      <div key={index} className="flex items-start space-x-3 text-sm">
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                          entry.status === 'SUCCESSFUL' ? 'bg-green-500' :
                          entry.status === 'FAILED' ? 'bg-red-500' :
                          entry.status === 'PENDING' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{entry.status}</span>
                            <span className="text-gray-500 text-xs">
                              {new Date(entry.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          {entry.message && (
                            <p className="text-gray-600 mt-1">{entry.message}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              {paymentStatus?.status === 'PENDING' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
                      <ol className="text-blue-800 text-sm space-y-1 list-decimal list-inside">
                        <li>Check your phone for an SMS or USSD prompt</li>
                        <li>Enter your mobile money PIN to authorize the payment</li>
                        <li>Wait for confirmation (this page will update automatically)</li>
                      </ol>
                      <p className="text-blue-700 text-xs mt-3">
                        This page will automatically update when your payment is processed.
                        You can safely close this page and the payment will continue processing.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {paymentStatus?.status === 'SUCCESSFUL' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                    <div>
                      <h4 className="font-semibold text-green-900">Payment Successful!</h4>
                      <p className="text-green-800 text-sm mt-1">
                        Your payment of {formatCurrency(currentPayment.amount)} has been processed successfully.
                      </p>
                      {paymentStatus.completedAt && (
                        <p className="text-green-700 text-xs mt-2">
                          Completed at: {new Date(paymentStatus.completedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {paymentStatus?.status === 'FAILED' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <XCircle className="h-6 w-6 text-red-500 mr-3" />
                    <div>
                      <h4 className="font-semibold text-red-900">Payment Failed</h4>
                      <p className="text-red-800 text-sm mt-1">
                        {paymentStatus.error || 'Your payment could not be processed. Please try again.'}
                      </p>
                      {paymentStatus.errorCode && (
                        <p className="text-red-700 text-xs mt-2">
                          Error Code: {paymentStatus.errorCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={startNewPayment}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  New Payment
                </button>
                
                {paymentStatus?.status === 'PENDING' && (
                  <button
                    onClick={checkPaymentStatus}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Refresh Status
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Technical Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">1</div>
              <div>
                <p className="font-medium text-gray-900">Payment Initiation</p>
                <p>Your payment request is sent to CamPay's secure payment gateway</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">2</div>
              <div>
                <p className="font-medium text-gray-900">Mobile Prompt</p>
                <p>You receive an SMS or USSD prompt on your phone to authorize the payment</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">3</div>
              <div>
                <p className="font-medium text-gray-900">Real-time Updates</p>
                <p>This page automatically updates via WebSocket connection when your payment status changes</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">4</div>
              <div>
                <p className="font-medium text-gray-900">Dual Tracking</p>
                <p>We use both webhook notifications and polling to ensure reliable status updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTracker;