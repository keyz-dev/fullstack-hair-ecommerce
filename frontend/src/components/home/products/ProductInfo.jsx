import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../../hooks/useCurrency';

const ProductInfo = ({ name, price, originalPrice, currency, isOnSale, stock }) => {
  const { convertPrice, formatPrice, userCurrency } = useCurrency();
  const [displayPrice, setDisplayPrice] = useState('');
  const [displayOriginalPrice, setDisplayOriginalPrice] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Convert and format prices
  useEffect(() => {
    const loadPrices = async () => {
      if (!price) {
        setDisplayPrice('');
        setDisplayOriginalPrice('');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Ensure currency is valid, default to XAF if not
        const validCurrency = currency || 'XAF';
        
        // Convert price to user's currency
        const convertedPrice = await convertPrice(price, validCurrency, userCurrency);
        const formattedPrice = formatPrice(convertedPrice, userCurrency);
        setDisplayPrice(formattedPrice);
        
        // Convert original price if it exists
        if (originalPrice && originalPrice > price) {
          const convertedOriginalPrice = await convertPrice(originalPrice, validCurrency, userCurrency);
          const formattedOriginalPrice = formatPrice(convertedOriginalPrice, userCurrency);
          setDisplayOriginalPrice(formattedOriginalPrice);
        } else {
          setDisplayOriginalPrice('');
        }
      } catch (error) {
        console.error('Error converting price:', error);
        // Fallback to original price with proper currency handling
        const fallbackCurrency = currency || 'XAF';
        setDisplayPrice(`${price} ${fallbackCurrency}`);
        if (originalPrice && originalPrice > price) {
          setDisplayOriginalPrice(`${originalPrice} ${fallbackCurrency}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPrices();
  }, [price, originalPrice, currency, userCurrency, convertPrice, formatPrice]);

  return (
    <div className="p-4 space-y-1">
      <h3 className="
        font-medium text-primary text-sm leading-tight
        line-clamp-2 group-hover:text-gray-700
        transition-colors duration-200
      ">  
        {name}
      </h3>
      
      {/* Price Display */}
      <div className="flex items-baseline gap-2 mt-2">
        {isLoading ? (
          <div className="text-lg font-bold text-gray-400 animate-pulse">
            Loading...
          </div>
        ) : isOnSale && displayOriginalPrice ? (
          <>
            <span className="text-lg font-bold text-primary tracking-tight">
              {displayPrice}
            </span>
            <span className="text-sm text-gray-500 line-through font-medium">
              {displayOriginalPrice}
            </span>
          </>
        ) : (
          <span className="text-lg font-bold text-primary tracking-tight">
            {displayPrice}
          </span>
        )}
      </div>
      
      {/* Stock indicator */}
      {stock <= 5 && stock > 0 && (
        <p className="text-xs text-amber-600 font-medium mt-1">
          Only {stock} left in stock
        </p>
      )}
    </div>
  );
};

export default ProductInfo;