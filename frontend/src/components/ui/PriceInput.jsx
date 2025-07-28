import React from 'react';
import CurrencySelector from './CurrencySelector';

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
  placeholder = 'Enter price'
}) => {
  return (
    <div className={className}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="flex">
        {/* Currency Selector */}
        <div className="flex-shrink-0">
          <CurrencySelector
            value={currency}
            onChange={onCurrencyChange}
            showLabel={false}
            disabled={disabled}
            className="w-24"
          />
        </div>
        
        {/* Price Input */}
        <div className="flex-1 ml-0">
          <input
            type="number"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            step="0.01"
            min="0"
            className={`
              w-full px-3 py-2 border-l-0 rounded-r-md shadow-sm
              focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
              ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
              ${error ? 'border-red-300' : 'border-gray-300'}
            `}
          />
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default PriceInput; 