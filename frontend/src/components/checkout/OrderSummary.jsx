import React from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import { calculateShipping } from '../../services/shippingService';

const OrderSummary = ({ 
  cartItems, 
  cartTotal, 
  shippingAddress,
  selectedPaymentMethod 
}) => {
  const { convertPrice, formatPrice } = useCurrency();
  const shippingInfo = calculateShipping(shippingAddress.city, cartTotal);
  const tax = cartTotal * 0.195; // 19.5% VAT
  const processingFee = selectedPaymentMethod?.fees ? (cartTotal * selectedPaymentMethod.fees) / 100 : 0;
  const total = cartTotal + shippingInfo.cost + tax + processingFee;

  return (
    <div className="lg:w-96">
      <div className="bg-white rounded-sm border border-gray-200 p-6 sticky top-4">
        <h3 className="text-lg font-semibold text-primary mb-4">Order Summary</h3>
        
        {/* Cart Items */}
        <div className="space-y-3 mb-4">
          {cartItems.map((item) => {
            // Convert item price to user's preferred currency
            const convertedItemPrice = convertPrice(item.price, item.currency);
            const formattedItemPrice = formatPrice(convertedItemPrice * item.quantity);
            
            return (
              <div key={item._id} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                  <img
                    src={item.images?.[0] || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-primary truncate">{item.name}</h4>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-sm">
                  {formattedItemPrice}
                </p>
              </div>
            );
          })}
        </div>

        {/* Order Totals */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">
              {formatPrice(cartTotal)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className={`font-medium ${shippingInfo.isFree ? 'text-green-600' : ''}`}>
              {shippingInfo.isFree ? 'Free' : formatPrice(shippingInfo.cost)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (VAT)</span>
            <span className="font-medium">
              {formatPrice(tax)}
            </span>
          </div>
          
          {processingFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Processing Fee</span>
              <span className="font-medium">
                {formatPrice(processingFee)}
              </span>
            </div>
          )}
          
          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold text-primary">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        {shippingAddress.city && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <h4 className="font-medium text-gray-800 text-sm mb-2">Shipping to:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>{shippingAddress.address}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
              <p>{shippingAddress.country}</p>
              <p className="text-green-600 font-medium mt-2">
                Delivery: {shippingInfo.deliveryTime}
              </p>
            </div>
          </div>
        )}

        {/* Payment Method */}
        {selectedPaymentMethod && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-800 text-sm mb-2">Payment Method:</h4>
            <div className="text-xs text-blue-700">
              <p className="font-medium">{selectedPaymentMethod.name}</p>
              {selectedPaymentMethod.description && (
                <p className="text-blue-600">{selectedPaymentMethod.description}</p>
              )}
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-xs">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary; 