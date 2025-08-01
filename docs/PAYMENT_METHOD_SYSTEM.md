# Scalable Payment Method System

## Overview

The payment method system has been completely overhauled to support various payment types with dynamic configuration and customer input fields. This system is designed to be scalable for international expansion and supports multiple payment gateways.

## Supported Payment Types

1. **Mobile Money** (MTN Momo, Orange Money, etc.)
2. **Bank Transfer**
3. **Card Payment** (Visa, Mastercard, etc.)
4. **PayPal**
5. **Cryptocurrency**
6. **Cash on Delivery**
7. **Other** (Custom payment methods)

## Architecture

### Backend Components

#### 1. Payment Method Model (`backend/src/models/paymentMethod.js`)
- **Enhanced Schema**: Supports different payment types with specific configurations
- **Nested Configurations**: Each payment type has its own configuration schema
- **Customer Fields**: Dynamic fields that customers need to provide
- **Virtual Properties**: Easy access to payment-specific configurations
- **Configuration Validation**: Built-in methods to verify setup completeness

#### 2. Validation Schemas (`backend/src/schema/paymentMethodSchema.js`)
- **Type-specific Validation**: Each payment type has its own validation rules
- **Configuration Schemas**: Separate validation for each payment configuration
- **Customer Field Validation**: Dynamic validation based on field types

#### 3. API Controllers (`backend/src/controller/paymentMethod.js`)
- **CRUD Operations**: Standard create, read, update, delete operations
- **Configuration Management**: Dedicated endpoints for configuration updates
- **Type Discovery**: API to get available payment types and their properties
- **Configuration Verification**: Endpoints to check if payment methods are properly configured

#### 4. API Routes (`backend/src/routes/paymentMethod.js`)
- `GET /types` - Get available payment method types
- `PUT /:id/config` - Update payment method configuration
- `GET /:id/verify` - Verify payment method configuration
- Standard CRUD routes for payment methods

### Frontend Components

#### 1. Admin Interface
- **PaymentMethodSettings**: Main settings page for payment methods
- **AddPaymentMethodModal**: Create new payment methods with type selection
- **PaymentMethodConfigModal**: Configure specific payment method settings
- **PaymentMethodListView**: Display and manage existing payment methods

#### 2. Context and Hooks
- **PaymentMethodContext**: Global state management for payment methods
- **usePaymentMethods**: Hook for accessing payment method functionality

#### 3. API Integration
- **paymentMethodApi**: Frontend API calls for all payment method operations

## Configuration Examples

### Mobile Money Configuration
```javascript
{
  type: 'MOBILE_MONEY',
  config: {
    mobileMoney: {
      accountNumber: '237612345678',
      accountName: 'John Doe',
      provider: 'MTN',
      apiKey: 'your-api-key',
      webhookUrl: 'https://your-domain.com/webhooks/momo'
    }
  },
  customerFields: [
    { name: 'phoneNumber', label: 'Phone Number', type: 'phone', required: true },
    { name: 'provider', label: 'Provider', type: 'select', required: true, options: ['MTN', 'ORANGE'] }
  ]
}
```

### PayPal Configuration
```javascript
{
  type: 'PAYPAL',
  config: {
    paypal: {
      clientId: 'your-client-id',
      clientSecret: 'your-client-secret',
      mode: 'sandbox', // or 'live'
      webhookId: 'your-webhook-id'
    }
  },
  customerFields: [
    { name: 'email', label: 'PayPal Email', type: 'email', required: true }
  ]
}
```

### Bank Transfer Configuration
```javascript
{
  type: 'BANK_TRANSFER',
  config: {
    bankTransfer: {
      bankName: 'First Bank',
      accountNumber: '1234567890',
      accountName: 'Your Business Name',
      swiftCode: 'FBNING',
      routingNumber: '123456789'
    }
  },
  customerFields: [
    { name: 'accountName', label: 'Account Name', type: 'text', required: true },
    { name: 'reference', label: 'Payment Reference', type: 'text', required: true }
  ]
}
```

## Usage Flow

### 1. Creating a Payment Method
1. Admin navigates to Payment Methods settings
2. Clicks "Add Payment Method"
3. Selects payment type (Mobile Money, PayPal, etc.)
4. Fills in basic information (name, description, fees, etc.)
5. System auto-generates customer fields based on payment type
6. Payment method is created

### 2. Configuring a Payment Method
1. Admin clicks "Configure" on a payment method that requires setup
2. Configuration modal opens with type-specific form
3. Admin fills in required configuration fields
4. System validates configuration
5. Payment method is marked as configured

### 3. Customer Payment Flow
1. Customer selects payment method during checkout
2. System renders customer input fields based on payment method configuration
3. Customer provides required information
4. Payment is processed according to payment type

## Integration with Payment Gateways

### Campay Integration (Mobile Money)
The system is designed to work with Campay for mobile money payments in Cameroon:

```javascript
// Example Campay configuration
{
  type: 'MOBILE_MONEY',
  config: {
    mobileMoney: {
      accountNumber: '237612345678',
      accountName: 'Business Name',
      provider: 'MTN',
      campayApiKey: 'your-campay-api-key',
      campayEnvironment: 'sandbox' // or 'live'
    }
  }
}
```

### Future Gateway Integrations
The system is designed to easily accommodate:
- Stripe for card payments
- PayPal for online payments
- Local bank APIs for bank transfers
- Cryptocurrency payment processors

## Benefits

1. **Scalability**: Easy to add new payment types and gateways
2. **Flexibility**: Dynamic configuration based on payment type
3. **User Experience**: Type-specific forms and validation
4. **Maintainability**: Modular architecture with clear separation of concerns
5. **International Ready**: Designed for global expansion
6. **Security**: Proper validation and configuration management

## Next Steps

1. **Testing**: Test with Campay API for mobile money
2. **Customer Forms**: Create customer-facing payment forms
3. **Webhook Handling**: Implement payment confirmation webhooks
4. **Payment Processing**: Add actual payment processing logic
5. **Analytics**: Add payment method usage analytics
6. **Multi-currency**: Extend for multi-currency support

## File Structure

```
frontend/src/components/dashboard/settings/payment/
├── PaymentMethodSettings.jsx          # Main settings page
├── AddPaymentMethodModal.jsx          # Create payment methods
├── PaymentMethodConfigModal.jsx       # Configure payment methods
├── PaymentMethodListView.jsx          # Display payment methods
└── index.js                          # Exports

backend/src/
├── models/paymentMethod.js            # Enhanced payment method model
├── schema/paymentMethodSchema.js      # Validation schemas
├── controller/paymentMethod.js        # API controllers
├── routes/paymentMethod.js            # API routes
└── utils/returnFormats/paymentMethodData.js  # Data formatting
```

This system provides a solid foundation for handling various payment methods while maintaining flexibility for future expansion and integration with different payment gateways. 