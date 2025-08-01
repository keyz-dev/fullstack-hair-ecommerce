import { validatePhoneNumber } from './normalizePhone';

export const validateCustomerInfo = (customerInfo) => {
  const errors = {};

  // Validate first name
  if (!customerInfo.firstName?.trim()) {
    errors.firstName = 'First name is required';
  } else if (customerInfo.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  // Validate last name
  if (!customerInfo.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  } else if (customerInfo.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!customerInfo.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(customerInfo.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate phone number
  const phoneValidation = validatePhoneNumber(customerInfo.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateShippingInfo = (shippingInfo) => {
  const errors = {};

  // Validate address
  if (!shippingInfo.address?.trim()) {
    errors.address = 'Address is required';
  }

  // Validate city
  if (!shippingInfo.city?.trim()) {
    errors.city = 'City is required';
  }

  // Validate postal code
  if (!shippingInfo.postalCode?.trim()) {
    errors.postalCode = 'Postal code is required';
  }

  // Validate country
  if (!shippingInfo.country?.trim()) {
    errors.country = 'Country is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validatePaymentInfo = (paymentInfo) => {
  const errors = {};

  // Validate payment method
  if (!paymentInfo.paymentMethod) {
    errors.paymentMethod = 'Please select a payment method';
  }

  // Check if it's a mobile money payment
  const isMobileMoney = paymentInfo.paymentMethod === 'MOBILE_MONEY' || 
                       paymentInfo.paymentMethod === 'mobile_money' ||
                       paymentInfo.paymentMethod?.toLowerCase().includes('mobile') ||
                       paymentInfo.paymentMethod?.toLowerCase().includes('mtn') ||
                       paymentInfo.paymentMethod?.toLowerCase().includes('orange');

  if (isMobileMoney) {
    // Check for mobile number field (could be named differently)
    const mobileNumberField = paymentInfo.mobileNumber || paymentInfo.phoneNumber || paymentInfo.phone;
    
    if (!mobileNumberField?.trim()) {
      errors.mobileNumber = 'Mobile number is required for mobile money payment';
    } else {
      const phoneValidation = validatePhoneNumber(mobileNumberField);
      if (!phoneValidation.isValid) {
        errors.mobileNumber = phoneValidation.error;
      }
    }
  }

  // Validate bank transfer fields
  const isBankTransfer = paymentInfo.paymentMethod === 'BANK_TRANSFER' || 
                        paymentInfo.paymentMethod === 'bank_transfer' ||
                        paymentInfo.paymentMethod?.toLowerCase().includes('bank');

  if (isBankTransfer) {
    if (!paymentInfo.accountNumber?.trim()) {
      errors.accountNumber = 'Account number is required for bank transfer';
    }
    
    if (!paymentInfo.accountName?.trim()) {
      errors.accountName = 'Account name is required for bank transfer';
    }
  }

  // Validate card payment fields
  const isCardPayment = paymentInfo.paymentMethod === 'CARD_PAYMENT' || 
                       paymentInfo.paymentMethod === 'card_payment' ||
                       paymentInfo.paymentMethod?.toLowerCase().includes('card') ||
                       paymentInfo.paymentMethod?.toLowerCase().includes('credit') ||
                       paymentInfo.paymentMethod?.toLowerCase().includes('debit');

  if (isCardPayment) {
    if (!paymentInfo.cardNumber?.trim()) {
      errors.cardNumber = 'Card number is required';
    }
    
    if (!paymentInfo.expiryDate?.trim()) {
      errors.expiryDate = 'Expiry date is required';
    }
    
    if (!paymentInfo.cvv?.trim()) {
      errors.cvv = 'CVV is required';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 