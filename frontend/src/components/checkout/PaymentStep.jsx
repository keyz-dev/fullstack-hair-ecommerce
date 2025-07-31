import React, { useState, useEffect, useMemo } from 'react';
import { Input, Button, Select } from '../ui';
import { CreditCard, Check, AlertCircle } from 'lucide-react';
import { usePublicPaymentMethods } from '../../hooks';

const PaymentStep = ({ 
  paymentInfo, 
  onPaymentInfoChange, 
  onPlaceOrder, 
  onBack,
  isProcessing,
  selectedPaymentMethod,
  onPaymentMethodSelect
}) => {
  const { activePaymentMethods, loading, error } = usePublicPaymentMethods();
  const [showPaymentFields, setShowPaymentFields] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Initialize payment info based on selected payment method
  useEffect(() => {
    if (selectedPaymentMethod) {
      setShowPaymentFields(selectedPaymentMethod.customerFields?.length > 0);
    }
  }, [selectedPaymentMethod]);

  // Memoize validation result to prevent infinite re-renders
  const { isValid, errors } = useMemo(() => {
    if (!selectedPaymentMethod) {
      return { isValid: false, errors: {} };
    }
    
    // Validate based on payment method's customer fields
    if (selectedPaymentMethod.customerFields?.length > 0) {
      const newErrors = {};
      let valid = true;
      
      selectedPaymentMethod.customerFields.forEach(field => {
        if (field.required && (!paymentInfo[field.name] || paymentInfo[field.name].trim() === '')) {
          newErrors[field.name] = `${field.label} is required`;
          valid = false;
        } else if (field.validation) {
          // Additional validation based on field type
          const value = paymentInfo[field.name];
          if (value) {
            if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
              newErrors[field.name] = `Invalid ${field.label.toLowerCase()} format`;
              valid = false;
            }
            if (field.validation.minLength && value.length < field.validation.minLength) {
              newErrors[field.name] = `${field.label} must be at least ${field.validation.minLength} characters`;
              valid = false;
            }
            if (field.validation.maxLength && value.length > field.validation.maxLength) {
              newErrors[field.name] = `${field.label} must be no more than ${field.validation.maxLength} characters`;
              valid = false;
            }
          }
        }
      });
      
      return { isValid: valid, errors: newErrors };
    }
    
    // For payment methods without customer fields (like Cash on Delivery)
    return { isValid: true, errors: {} };
  }, [selectedPaymentMethod, paymentInfo]);

  // Update field errors when validation result changes
  useEffect(() => {
    setFieldErrors(errors);
  }, [errors]);

  const handlePaymentMethodSelect = (method) => {
    onPaymentMethodSelect(method);
    setShowPaymentFields(method.customerFields?.length > 0);
    setFieldErrors({});
  };

  const renderPaymentField = (field) => {
    const commonProps = {
      label: field.label,
      name: field.name,
      value: paymentInfo[field.name] || '',
      onChangeHandler: onPaymentInfoChange,
      placeholder: field.placeholder,
      required: field.required,
      error: fieldErrors[field.name],
    };

    switch (field.type) {
      case 'email':
        return <Input {...commonProps} type="email" />;
      case 'phone':
        return <Input {...commonProps} type="tel" />;
      case 'number':
        return <Input {...commonProps} type="number" />;
      case 'select':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <Select
              name={field.name}
              value={paymentInfo[field.name] || ''}
              onChange={onPaymentInfoChange}
              options={field.options.map(option => ({label: option, value: option}))}
              placeholder={`Select ${field.label}`}
              error={fieldErrors[field.name]}
            />
          </div>
        );
      default:
        return <Input {...commonProps} type="text" />;
    }
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

  if (error) {
    return (
      <div className="bg-white rounded-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8 text-red-500">
          <AlertCircle size={20} className="mr-2" />
          <span>Failed to load payment methods. Please try again.</span>
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
          {activePaymentMethods
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
                {method.minAmount > 0 && (
                  <div className="mt-1 text-sm text-gray-600">
                    Minimum amount: {method.minAmount}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Payment Fields for Selected Method */}
      {showPaymentFields && selectedPaymentMethod?.customerFields && (
        <div className="space-y-4 border-t pt-6">
          <h3 className="font-medium text-gray-800">
            {selectedPaymentMethod.name} Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedPaymentMethod.customerFields.map((field) => (
              <div key={field.name} className={field.type === 'select' ? 'md:col-span-2' : ''}>
                {renderPaymentField(field)}
              </div>
            ))}
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
            <p><strong>Type:</strong> {selectedPaymentMethod.isOnline ? 'Online Payment' : 'Offline Payment'}</p>
            {selectedPaymentMethod.fees > 0 && (
              <p><strong>Processing Fee:</strong> {selectedPaymentMethod.fees}%</p>
            )}
            {selectedPaymentMethod.minAmount > 0 && (
              <p><strong>Minimum Amount:</strong> {selectedPaymentMethod.minAmount}</p>
            )}
            {selectedPaymentMethod.maxAmount && (
              <p><strong>Maximum Amount:</strong> {selectedPaymentMethod.maxAmount}</p>
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
          isDisabled={!isValid || isProcessing}
          isLoading={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep; 