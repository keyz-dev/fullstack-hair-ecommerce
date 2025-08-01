import React, { useState } from 'react';
import { usePaymentSocket } from '../hooks';
import { PaymentTracker } from '../components/payment';
import { Button } from '../components/ui';
import api from '../api';

const PaymentTest = () => {
  const { isConnected, trackPayment, getPaymentStatus, clearTrackedPayments } = usePaymentSocket();
  const [testPaymentRef, setTestPaymentRef] = useState('');
  const [simulationStatus, setSimulationStatus] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulatePayment = async () => {
    if (!testPaymentRef) {
      alert('Please enter a payment reference');
      return;
    }

    setIsSimulating(true);
    setSimulationStatus('Simulating successful payment...');

    try {
      // Simulate successful payment
      const response = await api.post('/payment/test/simulate', {
        reference: testPaymentRef,
        status: 'SUCCESSFUL'
      });

      if (response.data.success) {
        setSimulationStatus('Payment simulation started. Check the tracker below for real-time updates.');
      }
    } catch (error) {
      console.error('Simulation failed:', error);
      setSimulationStatus('Simulation failed: ' + error.message);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSimulateFailedPayment = async () => {
    if (!testPaymentRef) {
      alert('Please enter a payment reference');
      return;
    }

    setIsSimulating(true);
    setSimulationStatus('Simulating failed payment...');

    try {
      const response = await api.post('/payment/test/simulate', {
        reference: testPaymentRef,
        status: 'FAILED'
      });

      if (response.data.success) {
        setSimulationStatus('Payment simulation started. Check the tracker below for real-time updates.');
      }
    } catch (error) {
      console.error('Simulation failed:', error);
      setSimulationStatus('Simulation failed: ' + error.message);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Payment System Test</h1>
        <p className="text-gray-600">Test the real-time payment tracking system</p>
      </div>

      {/* Connection Status */}
      <div className={`mb-6 p-4 rounded-lg border ${
        isConnected 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        <div className="flex items-center justify-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="font-medium">
            Socket.IO Connection: {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Test Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-primary mb-4">Test Controls</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Reference
            </label>
            <input
              type="text"
              value={testPaymentRef}
              onChange={(e) => setTestPaymentRef(e.target.value)}
              placeholder="Enter a payment reference (e.g., PAY-123456789)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <Button
              onClickHandler={handleSimulatePayment}
              additionalClasses="bg-green-600 text-white hover:bg-green-700"
              isDisabled={!isConnected || isSimulating}
              isLoading={isSimulating}
            >
              Simulate Successful Payment
            </Button>

            <Button
              onClickHandler={handleSimulateFailedPayment}
              additionalClasses="bg-red-600 text-white hover:bg-red-700"
              isDisabled={!isConnected || isSimulating}
              isLoading={isSimulating}
            >
              Simulate Failed Payment
            </Button>

            <Button
              onClickHandler={clearTrackedPayments}
              additionalClasses="bg-gray-600 text-white hover:bg-gray-700"
              isDisabled={!isConnected}
            >
              Clear All
            </Button>
          </div>

          {simulationStatus && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800">{simulationStatus}</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Tracker */}
      {testPaymentRef && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Payment Tracker</h2>
          <PaymentTracker 
            paymentReference={testPaymentRef}
            amount={1000}
            phoneNumber="+237123456789"
          />
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-4">How to Test</h3>
        <div className="space-y-2 text-sm text-blue-700">
          <p>1. Enter a payment reference in the input field above</p>
          <p>2. Click "Simulate Successful Payment" or "Simulate Failed Payment"</p>
          <p>3. Watch the payment tracker below for real-time status updates</p>
          <p>4. The simulation will update the payment status after 2 seconds</p>
          <p>5. You'll see toast notifications for payment events</p>
        </div>
      </div>

      {/* API Endpoints Info */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Available API Endpoints</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>POST /api/payment/initiate</strong> - Initiate a payment</p>
          <p><strong>POST /api/payment/webhook</strong> - CamPay webhook endpoint</p>
          <p><strong>GET /api/payment/status/:orderId</strong> - Check payment status</p>
          <p><strong>GET /api/payment/tracking/:reference</strong> - Get payment from active tracking</p>
          <p><strong>GET /api/payment/debug/connections</strong> - Debug socket connections</p>
          <p><strong>POST /api/payment/test/simulate</strong> - Simulate payment flow (dev only)</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentTest; 