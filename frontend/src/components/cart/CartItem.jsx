import React, { useState, useEffect } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { convertPrice, formatPrice, userCurrency } = useCurrency();
  const [displayPrice, setDisplayPrice] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Convert and format price
  useEffect(() => {
    const loadPrice = async () => {
      if (!item.price) {
        setDisplayPrice('');
        setIsLoading(false);
        return;
      }
      
      // Ensure currency is valid, default to XAF if not
      const validCurrency = item.currency || 'XAF';

      try {
        setIsLoading(true);
        
        // Convert price to user's currency
        const convertedPrice = await convertPrice(item.price, validCurrency, userCurrency);
        const formattedPrice = formatPrice(convertedPrice, userCurrency);
        setDisplayPrice(formattedPrice);
      } catch (error) {
        console.error('Error converting price:', error);
        // Fallback to original price with proper currency handling
        const fallbackCurrency = item.currency || 'XAF';
        setDisplayPrice(`${item.price} ${fallbackCurrency}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrice();
  }, [item.price, item.currency, userCurrency, convertPrice, formatPrice]);

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
          {isLoading ? (
            <span className="text-gray-400 animate-pulse">Loading...</span>
          ) : (
            displayPrice
          )}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Quantity: {item.quantity}
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