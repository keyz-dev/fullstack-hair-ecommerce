import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Mail, Phone } from 'lucide-react';
import { Button } from '../components/ui';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderNumber, customerInfo, shippingAddress, orderSummary, selectedPaymentMethod } = location.state || {};

  if (!orderNumber) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Order Not Found</h1>
          <p className="text-gray-500 mb-8">Unable to retrieve order information.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xs font-medium hover:bg-accent/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-primary mb-2">Thank You!</h1>
        <p className="text-gray-600">Your order has been placed successfully</p>
      </div>

      <div className="bg-white rounded-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">Order Details</h2>
          <span className="text-lg font-bold text-accent">{orderNumber}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {customerInfo.firstName} {customerInfo.lastName}</p>
              <p><strong>Email:</strong> {customerInfo.email}</p>
              <p><strong>Phone:</strong> {customerInfo.phone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
            <div className="space-y-2 text-sm">
              <p>{shippingAddress.address}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
              <p>{shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-6 mt-6">
          <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
                         <div className="flex justify-between">
               <span>Subtotal:</span>
               <span>{orderSummary.subtotal} XAF</span>
             </div>
             <div className="flex justify-between">
               <span>Shipping:</span>
               <span>{orderSummary.shipping === 0 ? 'Free' : `${orderSummary.shipping} XAF`}</span>
             </div>
             <div className="flex justify-between">
               <span>Tax (VAT):</span>
               <span>{orderSummary.tax} XAF</span>
             </div>
             {orderSummary.processingFee > 0 && (
               <div className="flex justify-between">
                 <span>Processing Fee:</span>
                 <span>{orderSummary.processingFee} XAF</span>
               </div>
             )}
             <div className="flex justify-between font-semibold border-t pt-2">
               <span>Total:</span>
               <span>{orderSummary.total} XAF</span>
             </div>
          </div>
        </div>

        {/* Payment Method */}
        {selectedPaymentMethod && (
          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Method:</strong> {selectedPaymentMethod.name}</p>
              {selectedPaymentMethod.description && (
                <p><strong>Description:</strong> {selectedPaymentMethod.description}</p>
              )}
              <p><strong>Type:</strong> {selectedPaymentMethod.isOnline ? 'Online Payment' : 'Cash on Delivery'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-6 mb-8">
        <h3 className="font-semibold text-blue-800 mb-4">What's Next?</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800">Order Confirmation Email</p>
              <p className="text-sm text-blue-700">We've sent a confirmation email to {customerInfo.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800">Order Processing</p>
              <p className="text-sm text-blue-700">Your order will be processed within 24-48 hours</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800">Customer Support</p>
              <p className="text-sm text-blue-700">Need help? Contact us at support@braidcommerce.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/shop"
          className="inline-flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-xs font-medium hover:bg-accent/90 transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          to="/account/orders"
          className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xs font-medium hover:bg-gray-50 transition-colors"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation; 