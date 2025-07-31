import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyCart = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-primary mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xs font-medium hover:bg-accent/90 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart; 