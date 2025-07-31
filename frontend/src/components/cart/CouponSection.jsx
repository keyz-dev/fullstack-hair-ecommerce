import React from 'react';
import { Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../ui';

const CouponSection = ({
  couponCode,
  setCouponCode,
  appliedCoupon,
  isApplyingCoupon,
  couponError,
  isCouponExpanded,
  setIsCouponExpanded,
  onApplyCoupon,
  onRemoveCoupon,
  formatPrice
}) => {
  return (
    <div className="border-t border-gray-200 py-4">
      <button
        onClick={() => setIsCouponExpanded(!isCouponExpanded)}
        className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded-md transition-colors"
      >
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">
            {appliedCoupon ? `Coupon applied: ${appliedCoupon.code}` : 'Have a coupon? Enter your code.'}
          </span>
        </div>
        {isCouponExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      
      {isCouponExpanded && (
        <div className="mt-4 space-y-3">
          {!appliedCoupon ? (
            <div className="flex gap-3">
              <Input
                type="text"
                value={couponCode}
                onChangeHandler={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code"
                additionalClasses="border-line_clr"
                onKeyPress={(e) => e.key === 'Enter' && onApplyCoupon()}
              />
              <button
                onClick={onApplyCoupon}
                disabled={isApplyingCoupon || !couponCode.trim()}
                className="px-6 bg-primary text-white rounded-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApplyingCoupon ? 'APPLYING...' : 'APPLY'}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">{appliedCoupon.code}</span>
                <span className="text-green-600">
                  (-{appliedCoupon.type === 'percentage' ? `${appliedCoupon.discount}%` : formatPrice(appliedCoupon.discount)})
                </span>
              </div>
              <button
                onClick={onRemoveCoupon}
                className="text-green-600 hover:text-green-800 font-medium text-sm"
              >
                Remove
              </button>
            </div>
          )}
          
          {couponError && (
            <p className="text-red-500 text-sm">{couponError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponSection; 