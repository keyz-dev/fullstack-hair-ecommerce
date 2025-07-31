import React from 'react';
import { useCart } from '../hooks/useCart';
import useCoupon from '../hooks/useCoupon';
import { formatPrice } from '../utils/priceUtils';
import { EmptyCart, CartItemsList, OrderSummary } from '../components/cart';

const Cart = () => {
  const { 
    cartItems, 
    cartTotal, 
    cartItemCount, 
    removeFromCart, 
    updateQuantity, 
    clearCart 
  } = useCart();

  const {
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
  } = useCoupon(cartTotal);

  if (cartItemCount === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <CartItemsList
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onClearCart={clearCart}
          cartItemCount={cartItemCount}
        />

        <OrderSummary
          cartItems={cartItems}
          cartTotal={cartTotal}
          appliedCoupon={appliedCoupon}
          discountAmount={discountAmount}
          finalTotal={finalTotal}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          isApplyingCoupon={isApplyingCoupon}
          couponError={couponError}
          isCouponExpanded={isCouponExpanded}
          setIsCouponExpanded={setIsCouponExpanded}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={removeCoupon}
          formatPrice={formatPrice}
        />
      </div>
    </div>
  );
};

export default Cart;