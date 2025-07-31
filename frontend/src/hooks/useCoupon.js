import { useState } from 'react';

const useCoupon = (cartTotal) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [isCouponExpanded, setIsCouponExpanded] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    setCouponError('');
    
    // Simulate coupon validation (replace with actual API call)
    setTimeout(() => {
      const validCoupons = {
        'SAVE10': { discount: 10, type: 'percentage' },
        'FLAT5': { discount: 5, type: 'fixed' },
        'WELCOME15': { discount: 15, type: 'percentage' }
      };
      
      if (validCoupons[couponCode.toUpperCase()]) {
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          ...validCoupons[couponCode.toUpperCase()]
        });
        setCouponCode('');
        setIsCouponExpanded(false); // Collapse after successful application
      } else {
        setCouponError('Invalid coupon code');
      }
      setIsApplyingCoupon(false);
    }, 800);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    setIsCouponExpanded(false); // Collapse when coupon is removed
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === 'percentage') {
      return (cartTotal * appliedCoupon.discount) / 100;
    }
    return appliedCoupon.discount;
  };

  const discountAmount = calculateDiscount();
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return {
    couponCode,
    setCouponCode,
    appliedCoupon,
    isApplyingCoupon,
    couponError,
    isCouponExpanded,
    setIsCouponExpanded,
    handleApplyCoupon,
    removeCoupon,
    discountAmount,
    finalTotal
  };
};

export default useCoupon; 