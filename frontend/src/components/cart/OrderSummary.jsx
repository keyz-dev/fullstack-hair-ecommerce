import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CouponSection from './CouponSection';

const OrderSummary = ({
  cartItems,
  cartTotal,
  appliedCoupon,
  discountAmount,
  finalTotal,
  couponCode,
  setCouponCode,
  isApplyingCoupon,
  couponError,
  isCouponExpanded,
  setIsCouponExpanded,
  onApplyCoupon,
  onRemoveCoupon,
  formatPrice
}) => {
  return (
    <div className="lg:w-100">
      <div className="bg-white rounded-sm border border-gray-200 p-6 sticky top-4">
        <h2 className="text-lg font-bold text-primary mb-4">Order Summary</h2>

        {/* Coupon Section */}
        <CouponSection
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          appliedCoupon={appliedCoupon}
          isApplyingCoupon={isApplyingCoupon}
          couponError={couponError}
          isCouponExpanded={isCouponExpanded}
          setIsCouponExpanded={setIsCouponExpanded}
          onApplyCoupon={onApplyCoupon}
          onRemoveCoupon={onRemoveCoupon}
          formatPrice={formatPrice}
        />
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(cartTotal, cartItems[0]?.currency)}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-green-600">
                -{formatPrice(discountAmount, cartItems[0]?.currency)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">Free</span>
          </div>
        </div>

        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(finalTotal, cartItems[0]?.currency)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/checkout"
            className="w-full bg-primary text-white py-4 px-6 rounded-xs font-semibold hover:bg-primary/90 transition-colors text-center block text-sm tracking-wide"
          >
            PROCEED TO CHECKOUT
          </Link>

          <Link
            to="/shop"
            className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xs font-semibold hover:bg-gray-200 transition-colors text-center block text-sm tracking-wide flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary; 