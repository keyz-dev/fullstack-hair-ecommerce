import React from 'react';
import CartItem from './CartItem';

const CartItemsList = ({ cartItems, onUpdateQuantity, onRemove, onClearCart, cartItemCount }) => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Shopping Cart ({cartItemCount} items)</h1>
        <button
          onClick={onClearCart}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <CartItem
            key={item._id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default CartItemsList; 