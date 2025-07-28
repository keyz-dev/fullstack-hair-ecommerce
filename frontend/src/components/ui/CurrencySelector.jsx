import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { currencyApi } from '../../api/currency';

const CurrencySelector = ({ 
  value, 
  onChange, 
  className = '', 
  disabled = false,
  showLabel = true,
  label = 'Currency',
  error = null,
  required = false 
}) => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await currencyApi.getActiveCurrencies();
        setCurrencies(response.currencies || []);
      } catch (error) {
        console.error('Error fetching currencies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const selectedCurrency = currencies.find(c => c.code === value);

  const handleSelect = (currency) => {
    onChange(currency.code);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        {showLabel && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="animate-pulse bg-gray-200 h-10 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-left bg-white border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {selectedCurrency ? (
                <>
                  <span className="text-sm font-medium">{selectedCurrency.code}</span>
                  <span className="text-xs text-gray-500">({selectedCurrency.symbol})</span>
                </>
              ) : (
                <span className="text-gray-500">Select currency</span>
              )}
            </div>
            <ChevronDown 
              size={16} 
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                type="button"
                onClick={() => handleSelect(currency)}
                className={`
                  w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                  ${currency.code === value ? 'bg-accent text-white hover:bg-accent' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{currency.code}</span>
                    <span className="text-sm text-gray-500">{currency.symbol}</span>
                  </div>
                  {currency.isBase && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Base
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default CurrencySelector; 