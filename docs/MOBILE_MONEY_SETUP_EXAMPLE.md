# Mobile Money Payment Setup Example

This document shows how to set up mobile money payment methods with proper phone number validation in the Braid Commerce system.

## Payment Method Configuration

### Example Mobile Money Payment Method

```javascript
// Example payment method configuration for MTN Mobile Money
{
  name: "MTN Mobile Money",
  code: "MTN_MOBILE_MONEY",
  description: "Pay using MTN Mobile Money service",
  type: "MOBILE_MONEY",
  isOnline: true,
  isActive: true,
  fees: 1.5, // 1.5% processing fee
  minAmount: 100,
  maxAmount: 500000,
  sortOrder: 1,
  customerFields: [
    {
      name: "mobileNumber",
      label: "Mobile Number",
      type: "phone",
      required: true,
      placeholder: "Enter your MTN mobile number",
      validation: {
        minLength: 9,
        maxLength: 15
      }
    }
  ]
}

// Example payment method configuration for Orange Money
{
  name: "Orange Money",
  code: "ORANGE_MONEY", 
  description: "Pay using Orange Money service",
  type: "MOBILE_MONEY",
  isOnline: true,
  isActive: true,
  fees: 1.0, // 1% processing fee
  minAmount: 100,
  maxAmount: 1000000,
  sortOrder: 2,
  customerFields: [
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "phone",
      required: true,
      placeholder: "Enter your Orange phone number",
      validation: {
        minLength: 9,
        maxLength: 15
      }
    }
  ]
}
```

## Frontend Implementation

The PaymentStep component now automatically:

1. **Detects phone fields** in payment method configuration
2. **Renders PhoneInput component** for phone type fields
3. **Validates phone numbers** using international standards
4. **Shows real-time validation errors**
5. **Prevents form submission** with invalid phone numbers

## Backend Validation

The backend now includes:

1. **Schema validation** using Joi with custom phone validation
2. **Phone normalization** to E.164 format
3. **International phone validation** using libphonenumber-js
4. **Payment method specific validation** rules

## Testing the Implementation

### Test Cases

1. **Valid Cameroon Numbers**:
   - `+237612345678`
   - `237612345678`
   - `612345678`

2. **Valid International Numbers**:
   - `+1234567890` (US)
   - `+447911123456` (UK)
   - `+2348012345678` (Nigeria)

3. **Invalid Numbers**:
   - `123` (too short)
   - `abcdef` (non-numeric)
   - `+237123` (invalid Cameroon format)

### API Testing

```bash
# Test payment initiation with valid phone number
curl -X POST http://localhost:5000/api/payment/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order_id_here",
    "phoneNumber": "+237612345678"
  }'

# Test with invalid phone number
curl -X POST http://localhost:5000/api/payment/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order_id_here", 
    "phoneNumber": "123"
  }'
```

## Error Messages

The system provides clear error messages:

- **"Phone number is required"** - When no phone number is provided
- **"Invalid phone number format"** - When format is incorrect
- **"Invalid phone number"** - When number is not valid for the country
- **"Please provide a valid phone number with country code"** - Backend validation error

## Integration with Payment Providers

The normalized phone numbers are sent to payment providers like Campay:

```javascript
// Example payment data sent to Campay
{
  amount: 5000,
  phoneNumber: "+237612345678", // Normalized E.164 format
  description: "Payment for BraidSter order #12345678",
  orderId: "order_id",
  currency: "XAF"
}
```

## Benefits

1. **Professional UX** - Country code selection with flags
2. **International Support** - Works with any country's phone numbers
3. **Real-time Validation** - Immediate feedback to users
4. **Consistent Format** - All numbers stored in E.164 format
5. **Error Prevention** - Prevents invalid payments
6. **Mobile Money Ready** - Optimized for mobile payment flows 