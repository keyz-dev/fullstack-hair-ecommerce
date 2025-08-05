import React, { useState, useEffect } from 'react';
import { Input, CurrencySelector } from '.';
import { useCurrency } from '../../hooks/useCurrency';

const PriceInput = ({
  price,
  currency,
  onPriceChange,
  onCurrencyChange,
  className = '',
  disabled = false,
  showLabel = true,
  label = 'Price',
  error = null,
  required = false,
  placeholder = 'Enter price',
  showCurrencySelector = true,
  allowCurrencyChange = true
}) => {
  const { getCurrencyInfo, formatPrice } = useCurrency();
  const [displayPrice, setDisplayPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Format price for display when currency changes
  useEffect(() => {
    if (price && currency) {
      setIsLoading(true);
      try {
        const formatted = formatPrice(price, currency);
        setDisplayPrice(formatted);
      } catch (error) {
        console.error('Error formatting price:', error);
        setDisplayPrice(`${price} ${currency}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      setDisplayPrice('');
    }
  }, [price, currency, formatPrice]);

  const handleCurrencyChange = async (newCurrency) => {
    if (onCurrencyChange) {
      onCurrencyChange(newCurrency);
    }
  };

  return (
    <div className={className}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="flex">
        {/* Currency Selector */}
        {showCurrencySelector && (
          <div className="flex-shrink-0">
            <CurrencySelector
              value={currency}
              onChange={handleCurrencyChange}
              showLabel={false}
              disabled={disabled || !allowCurrencyChange}
              className="w-32"
            />
          </div>
        )}
        
        {/* Price Input */}
        <div className="flex-1 ml-0">
          <Input
            name="price"
            type="number"
            value={price || ''}
            onChangeHandler={onPriceChange}
            error={error}
            disabled={disabled}
            required={required}
            additionalClasses="border-line_clr"
            placeholder={placeholder}
            step="0.01"
            min="0"
          />
        </div>
      </div>

      {/* Display formatted price */}
      {displayPrice && !isLoading && (
        <div className="mt-1 text-xs text-gray-500">
          Display: {displayPrice}
        </div>
      )}

      {isLoading && (
        <div className="mt-1 text-xs text-gray-400">
          Formatting price...
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default PriceInput; 