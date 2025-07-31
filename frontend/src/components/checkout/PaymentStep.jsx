import React, { useState } from 'react';
import { Input, Button } from '../ui';
import { CreditCard, Check } from 'lucide-react';
import { usePaymentMethods } from '../../hooks';

const PaymentStep = ({ 
  paymentInfo, 
  onPaymentInfoChange, 
  onPlaceOrder, 
  onBack,
  isProcessing,
  selectedPaymentMethod,
  onPaymentMethodSelect
}) => {
  const { paymentMethods, loading } = usePaymentMethods();
  const [showCardDetails, setShowCardDetails] = useState(false);

  const validateStep = () => {
    if (!selectedPaymentMethod) return false;
    
    // For online payment methods, require card details
    if (selectedPaymentMethod.isOnline) {
      return paymentInfo.cardNumber && 
             paymentInfo.expiryDate && 
             paymentInfo.cvv && 
             paymentInfo.cardholderName;
    }
    
    // For offline methods like cash on delivery, no card details needed
    return true;
  };

  const handlePaymentMethodSelect = (method) => {
    onPaymentMethodSelect(method);
    setShowCardDetails(method.isOnline);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-600">Loading payment methods...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-primary mb-6">Payment Information</h2>
      
      {/* Payment Method Selection */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-800 mb-3">Select Payment Method</h3>
        <div className="space-y-3">
          {paymentMethods
            .filter(method => method.isActive)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((method) => (
              <div
                key={method._id}
                className={`border rounded-md p-4 cursor-pointer transition-colors ${
                  selectedPaymentMethod?._id === method._id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePaymentMethodSelect(method)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {method.icon && (
                      <img 
                        src={method.icon} 
                        alt={method.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-800">{method.name}</h4>
                      {method.description && (
                        <p className="text-sm text-gray-600">{method.description}</p>
                      )}
                    </div>
                  </div>
                  {selectedPaymentMethod?._id === method._id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
                {method.fees > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    Processing fee: {method.fees}%
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Card Details for Online Payment Methods */}
      {showCardDetails && selectedPaymentMethod?.isOnline && (
        <div className="space-y-4 border-t pt-6">
          <h3 className="font-medium text-gray-800">Card Details</h3>
          <Input
            label="Card Number"
            name="cardNumber"
            value={paymentInfo.cardNumber}
            onChangeHandler={onPaymentInfoChange}
            placeholder="1234 5678 9012 3456"
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Expiry Date"
              name="expiryDate"
              value={paymentInfo.expiryDate}
              onChangeHandler={onPaymentInfoChange}
              placeholder="MM/YY"
              required
            />
            <Input
              label="CVV"
              name="cvv"
              value={paymentInfo.cvv}
              onChangeHandler={onPaymentInfoChange}
              placeholder="123"
              required
            />
            <Input
              label="Cardholder Name"
              name="cardholderName"
              value={paymentInfo.cardholderName}
              onChangeHandler={onPaymentInfoChange}
              required
            />
          </div>
        </div>
      )}

      {/* Payment Method Info */}
      {selectedPaymentMethod && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-medium text-blue-800 mb-2">Payment Method Information</h3>
          <div className="space-y-1 text-sm text-blue-700">
            <p><strong>Method:</strong> {selectedPaymentMethod.name}</p>
            {selectedPaymentMethod.description && (
              <p><strong>Description:</strong> {selectedPaymentMethod.description}</p>
            )}
            {selectedPaymentMethod.isOnline ? (
              <p><strong>Type:</strong> Online Payment</p>
            ) : (
              <p><strong>Type:</strong> Cash on Delivery</p>
            )}
            {selectedPaymentMethod.fees > 0 && (
              <p><strong>Processing Fee:</strong> {selectedPaymentMethod.fees}%</p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Button
          onClickHandler={onBack}
          additionalClasses="border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Back
        </Button>
        <Button
          onClickHandler={onPlaceOrder}
          additionalClasses="bg-primary text-white hover:bg-primary/90"
          isDisabled={!validateStep() || isProcessing}
          isLoading={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep; 