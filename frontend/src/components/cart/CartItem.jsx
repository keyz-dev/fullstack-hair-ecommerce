import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const formatPrice = (price, currency) => {
    if (currency && currency.symbol) {
      return currency.position === 'after' 
        ? `${price} ${currency.symbol}`
        : `${currency.symbol} ${price}`;
    }
    return `$${price}`;
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-sm border border-gray-200">
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
          onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
        >
          <Minus size={14} />
        </button>
        <span className="w-12 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item._id)}
        className="text-red-500 hover:text-red-700 p-2"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default CartItem; 