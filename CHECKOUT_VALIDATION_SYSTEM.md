# Checkout Validation System - Complete Integration

This document explains how the checkout validation system works together across all components and hooks.

## System Overview

The checkout validation system consists of three main parts:

1. **Validation Utilities** (`frontend/src/utils/checkoutValidation.js`)
2. **useCheckout Hook** (`frontend/src/hooks/useCheckout.js`)
3. **Step Components** (CustomerInfoStep, ShippingStep, PaymentStep)

## Validation Flow

### 1. Customer Information Step

**Component**: `CustomerInfoStep.jsx`
**Hook Integration**: `useCheckout.js` → `validateStep1()`
**Validation**: `validateCustomerInfo()` utility

```javascript
// CustomerInfoStep uses validateCustomerInfo directly
const validation = validateCustomerInfo(customerInfo);
if (validation.isValid) {
  onNext();
} else {
  setErrors(validation.errors);
}

// useCheckout hook also validates
const validateStep1 = () => {
  const validation = validateCustomerInfo(customerInfo);
  return validation.isValid;
};
```

**Fields Validated**:
- ✅ First Name (required, min 2 chars)
- ✅ Last Name (required, min 2 chars)
- ✅ Email (required, valid format)
- ✅ Phone Number (required, international validation)

### 2. Shipping Information Step

**Component**: `ShippingStep.jsx`
**Hook Integration**: `useCheckout.js` → `validateStep2()`
**Validation**: `validateShippingInfo()` utility

```javascript
// useCheckout hook validates
const validateStep2 = () => {
  const validation = validateShippingInfo(shippingAddress);
  return validation.isValid;
};
```

**Fields Validated**:
- ✅ Address (required)
- ✅ City (required)
- ✅ Postal Code (required)
- ✅ Country (required)

### 3. Payment Information Step

**Component**: `PaymentStep.jsx`
**Hook Integration**: `useCheckout.js` → `validateStep3()`
**Validation**: `validatePaymentInfo()` utility

```javascript
// PaymentStep uses validatePaymentInfo for real-time validation
const validation = validatePaymentInfo({
  paymentMethod: selectedPaymentMethod.code || selectedPaymentMethod.type,
  ...paymentInfo
});

// useCheckout hook also validates
const validateStep3 = () => {
  const validation = validatePaymentInfo({
    paymentMethod: selectedPaymentMethod.code || selectedPaymentMethod.type,
    ...paymentInfo
  });
  return validation.isValid;
};
```

**Payment Methods Supported**:

#### Mobile Money Payments
- **Detection**: `MOBILE_MONEY`, `mobile_money`, contains 'mobile', 'mtn', 'orange'
- **Fields**: `mobileNumber`, `phoneNumber`, or `phone`
- **Validation**: International phone number validation

#### Bank Transfer
- **Detection**: `BANK_TRANSFER`, `bank_transfer`, contains 'bank'
- **Fields**: `accountNumber`, `accountName`
- **Validation**: Required field validation

#### Card Payments
- **Detection**: `CARD_PAYMENT`, `card_payment`, contains 'card', 'credit', 'debit'
- **Fields**: `cardNumber`, `expiryDate`, `cvv`
- **Validation**: Required field validation

## Phone Number Validation Integration

### Frontend Phone Input
```javascript
// PhoneInput component automatically handles:
// - Country code selection with flags
// - Real-time validation
// - International format support
// - Error display

<PhoneInput
  label="Mobile Number"
  name="mobileNumber"
  value={paymentInfo.mobileNumber}
  onChangeHandler={handleInputChange}
  error={fieldErrors.mobileNumber}
  required
/>
```

### Backend Phone Validation
```javascript
// Payment controller validates phone numbers
const phoneValidation = validatePhoneNumber(phoneNumber);
if (!phoneValidation.isValid) {
  return next(new BadRequestError(phoneValidation.error));
}

// Normalize to E.164 format
const normalizedPhone = normalizePhoneNumber(phoneNumber);
```

## Payment Method Configuration

Payment methods are configured with `customerFields` that define what fields customers need to fill:

```javascript
// Example MTN Mobile Money configuration
{
  name: "MTN Mobile Money",
  code: "MTN_MOBILE_MONEY",
  type: "MOBILE_MONEY",
  customerFields: [
    {
      name: "mobileNumber",
      label: "Mobile Number",
      type: "phone",
      required: true,
      placeholder: "Enter your MTN mobile number"
    }
  ]
}
```

## Validation Error Handling

### Frontend Error Display
```javascript
// Components show errors in real-time
{error && <p className="text-error text-xs mt-1">{error}</p>}

// Errors are cleared when user starts typing
const handleInputChange = (e) => {
  onPaymentInfoChange(e);
  if (fieldErrors[name]) {
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  }
};
```

### Backend Error Response
```javascript
// Backend returns structured error messages
{
  success: false,
  message: "Please provide a valid phone number with country code"
}
```

## Order Processing Flow

### 1. Validation Before Order Creation
```javascript
const handlePlaceOrder = async () => {
  if (!validateStep3()) return; // Prevents invalid orders
  
  // Create order...
  const response = await orderApi.createOrder(orderData);
};
```

### 2. Mobile Money Payment Initiation
```javascript
// Check if mobile money payment
const isMobileMoney = selectedPaymentMethod.type === 'MOBILE_MONEY' || 
                     selectedPaymentMethod.code === 'MOBILE_MONEY' ||
                     selectedPaymentMethod.code?.toLowerCase().includes('mobile');

// Get phone number from payment info
const phoneNumber = paymentInfo.mobileNumber || paymentInfo.phoneNumber || paymentInfo.phone;

if (isMobileMoney && phoneNumber) {
  // Initiate payment with validated phone number
  const paymentResponse = await api.post('/payment/initiate', {
    orderId: createdOrder._id,
    phoneNumber: phoneNumber,
    amount: total
  });
}
```

## Testing the System

### Valid Test Cases
```javascript
// Customer Info
{
  firstName: "John",
  lastName: "Doe", 
  email: "john@example.com",
  phone: "+237612345678"
}

// Mobile Money Payment
{
  paymentMethod: "MTN_MOBILE_MONEY",
  mobileNumber: "+237612345678"
}
```

### Invalid Test Cases
```javascript
// Invalid phone number
{
  phone: "123" // Too short
}

// Missing required fields
{
  firstName: "", // Required
  mobileNumber: "" // Required for mobile money
}
```

## Benefits of This System

1. **Consistent Validation**: Same validation logic used across components and hooks
2. **Real-time Feedback**: Users see errors immediately as they type
3. **International Support**: Phone numbers work for any country
4. **Flexible Payment Methods**: Easy to add new payment methods with custom fields
5. **Error Prevention**: Prevents invalid orders from being created
6. **Professional UX**: Country code selection with flags and proper error messages

## Future Enhancements

1. **SMS Verification**: Add phone number verification via SMS
2. **Address Validation**: Integrate with address validation services
3. **Card Validation**: Add Luhn algorithm for card number validation
4. **Auto-complete**: Add address and phone number auto-complete
5. **Preferred Countries**: Allow setting preferred countries for phone input 