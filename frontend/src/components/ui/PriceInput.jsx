import React from 'react';
import CurrencySelector from './CurrencySelector';
import { Input } from '.';

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
            className="w-25"
          />
        </div>
        
        {/* Price Input */}
        <div className="flex-1 ml-0">
          <Input
            name="price"
            type="number"
            value={price}
            onChangeHandler={onPriceChange}
            error={error}
            disabled={disabled}
            required
            additionalClasses="border-line_clr"
            placeholder={placeholder}
            step="0.01"
            min="0"
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