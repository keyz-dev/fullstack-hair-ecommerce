import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';

const CurrencySelector = () => {
  const { userCurrency, availableCurrencies, changeCurrency, getCurrencyInfo } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currentCurrency = getCurrencyInfo(userCurrency);

  const handleCurrencyChange = (currencyCode) => {
    changeCurrency(currencyCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
      >
        <Globe size={16} />
        <span className="font-medium">{currentCurrency.symbol || currentCurrency.code}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            {availableCurrencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                  currency.code === userCurrency ? 'bg-accent text-white' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{currency.symbol || currency.code}</span>
                  <span className="text-xs opacity-75">{currency.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CurrencySelector; 