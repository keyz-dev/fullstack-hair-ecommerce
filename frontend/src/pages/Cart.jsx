import React from 'react';
import { useCart } from '../hooks/useCart';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { 
    cartItems, 
    cartTotal, 
    cartItemCount, 
    removeFromCart, 
    updateQuantity, 
    clearCart 
  } = useCart();

  const formatPrice = (price, currency) => {
    if (currency && currency.symbol) {
      return currency.position === 'after' 
        ? `${price} ${currency.symbol}`
        : `${currency.symbol} ${price}`;
    }
    return `${price}`;
  };

  if (cartItemCount === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-primary">Shopping Cart ({cartItemCount} items)</h1>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4 p-4 bg-white rounded-sm border border-gray-200">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                  <img
                    src={item.images?.[0] || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-primary truncate">{item.name}</h3>
                  <p className="text-lg font-bold text-accent mt-1">
                    {formatPrice(item.price, item.currency)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="bg-white rounded-sm border border-gray-200 p-6 sticky top-4">
            <h2 className="text-lg font-bold text-primary mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(cartTotal, cartItems[0]?.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold text-accent">
                  {formatPrice(cartTotal, cartItems[0]?.currency)}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-accent text-white py-3 px-4 rounded-sm font-medium hover:bg-accent/90 transition-colors text-center block"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/shop"
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-sm font-medium hover:bg-gray-200 transition-colors text-center block mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;