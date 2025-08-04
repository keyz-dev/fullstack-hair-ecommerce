import React, { useState } from 'react';
import { ChevronDown, Globe, RefreshCw } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';

const CurrencySelector = ({ 
  value, 
  onChange, 
  showLabel = true,
  disabled = false,
  className = ''
}) => {
  const { 
    userCurrency, 
    availableCurrencies, 
    changeCurrency, 
    getCurrencyInfo, 
    isLoading, 
    refreshRates 
  } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use provided value or fallback to userCurrency
  const currentCurrency = value || userCurrency;
  const currentCurrencyInfo = getCurrencyInfo(currentCurrency);

  const handleCurrencyChange = async (currencyCode) => {
    if (onChange) {
      // If onChange is provided, use it (for controlled components)
      onChange(currencyCode);
    } else {
      // Otherwise, change the global user currency
      const success = await changeCurrency(currencyCode);
      if (success) {
        setIsOpen(false);
      }
    }
  };

  const handleRefreshRates = async () => {
    setIsRefreshing(true);
    try {
      await refreshRates();
    } catch (error) {
      console.error('Error refreshing rates:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`border border-line_clr flex items-center gap-1 px-3 py-2 text-sm text-gray-500 rounded-xs ${className}`}>
        <Globe size={16} />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`border border-line_clr flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xs transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <Globe size={16} />
        <span className="font-medium">{currentCurrencyInfo?.symbol || currentCurrency}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-xs shadow-lg z-50">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Exchange Rates</span>
              <button
                onClick={handleRefreshRates}
                disabled={isRefreshing}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                title="Refresh exchange rates"
              >
                <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
          
          <div className="py-1 max-h-64 overflow-y-auto">
            {availableCurrencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                  currency.code === currentCurrency ? 'bg-accent text-white' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{currency.symbol || currency.code}</span>
                    <span className="text-xs opacity-75">{currency.name}</span>
                  </div>
                  {currency.code === currentCurrency && (
                    <span className="text-xs">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && !disabled && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CurrencySelector; 