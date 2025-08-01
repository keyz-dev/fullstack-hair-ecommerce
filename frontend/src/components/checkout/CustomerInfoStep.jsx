import React, { useState } from 'react';
import { Input, Button, PhoneInput } from '../ui';
import { User } from 'lucide-react';
import { validateCustomerInfo } from '../../utils/checkoutValidation';

const CustomerInfoStep = ({ 
  customerInfo, 
  onCustomerInfoChange, 
  onNext, 
  isAuthenticated,
  onSignIn 
}) => {
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const validation = validateCustomerInfo(customerInfo);
    if (validation.isValid) {
      setErrors({});
      onNext();
    } else {
      setErrors(validation.errors);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onCustomerInfoChange(e);
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="bg-white rounded-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-primary mb-6">Customer Information</h2>
      
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800 text-sm">
            You're checking out as a guest. 
            <button 
              className="text-blue-600 underline ml-1 hover:text-blue-800"
              onClick={onSignIn}
            >
              Sign in
            </button> 
            for faster checkout and order tracking.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          value={customerInfo.firstName}
          onChangeHandler={handleInputChange}
          error={errors.firstName}
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          value={customerInfo.lastName}
          onChangeHandler={handleInputChange}
          error={errors.lastName}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={customerInfo.email}
          onChangeHandler={handleInputChange}
          error={errors.email}
          required
        />
        <PhoneInput
          label="Phone Number"
          name="phone"
          value={customerInfo.phone}
          onChangeHandler={handleInputChange}
          error={errors.phone}
          required
        />
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClickHandler={handleNext}
          additionalClasses="bg-primary text-white hover:bg-primary/90"
        >
          Continue to Shipping
        </Button>
      </div>
    </div>
  );
};

export default CustomerInfoStep; 