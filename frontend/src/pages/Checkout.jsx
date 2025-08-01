import React from 'react';
import { useCart, useAuth, useCheckout } from '../hooks';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  CustomerInfoStep,
  ShippingStep,
  PaymentStep,
  OrderSummary,
  CheckoutProgress
} from '../components/checkout';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const {
    // State
    checkoutStep,
    isProcessing,
    customerInfo,
    shippingAddress,
    paymentInfo,
    selectedPaymentMethod,
    
    // Handlers
    handleCustomerInfoChange,
    handleShippingAddressChange,
    handlePaymentInfoChange,
    handlePaymentMethodSelect,
    handleNextStep,
    handlePreviousStep,
    handlePlaceOrder,
    handleSignIn
  } = useCheckout(cartItems, cartTotal, user, clearCart);

  if (cartItems.length === 0) {
    return null; // Will redirect to cart
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/cart"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          Back to Cart
        </Link>
        <h1 className="text-2xl font-bold text-primary">Checkout</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="flex-1">
          <CheckoutProgress currentStep={checkoutStep} />

          {/* Step 1: Customer Information */}
          {checkoutStep === 1 && (
            <CustomerInfoStep
              customerInfo={customerInfo}
              onCustomerInfoChange={handleCustomerInfoChange}
              onNext={handleNextStep}
              isAuthenticated={!!user}
              onSignIn={handleSignIn}
            />
          )}

          {/* Step 2: Shipping Address */}
          {checkoutStep === 2 && (
            <ShippingStep
              shippingAddress={shippingAddress}
              onShippingAddressChange={handleShippingAddressChange}
              onNext={handleNextStep}
              onBack={handlePreviousStep}
              subtotal={cartTotal}
            />
          )}

          {/* Step 3: Payment */}
          {checkoutStep === 3 && (
            <PaymentStep
              paymentInfo={paymentInfo}
              onPaymentInfoChange={handlePaymentInfoChange}
              onPlaceOrder={handlePlaceOrder}
              onBack={handlePreviousStep}
              isProcessing={isProcessing}
              selectedPaymentMethod={selectedPaymentMethod}
              onPaymentMethodSelect={handlePaymentMethodSelect}
            />
          )}
        </div>

        {/* Order Summary */}
        <OrderSummary
          cartItems={cartItems}
          cartTotal={cartTotal}
          shippingAddress={shippingAddress}
          selectedPaymentMethod={selectedPaymentMethod}
        />
      </div>
    </div>
  );
};

export default Checkout;