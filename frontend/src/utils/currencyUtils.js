// Currency formatting utility functions

/**
 * Format a price with currency symbol
 * @param {number} amount - The amount to format
 * @param {Object} currency - Currency object with symbol and position
 * @param {string} currency.symbol - Currency symbol (e.g., "$", "€", "₦")
 * @param {string} currency.position - Position of symbol ("before" or "after")
 * @param {string} fallbackCode - Fallback currency code if no symbol
 * @returns {string} Formatted price string
 */
export const formatPriceWithSymbol = (amount, currency, fallbackCode = 'XAF') => {
  if (!amount && amount !== 0) return '';
  
  const formattedAmount = typeof amount === 'number' 
    ? amount.toLocaleString() 
    : parseFloat(amount).toLocaleString();
  
  if (!currency || !currency.symbol) {
    return `${formattedAmount} ${fallbackCode}`;
  }
  
  if (currency.position === 'after') {
    return `${formattedAmount} ${currency.symbol}`;
  } else {
    return `${currency.symbol} ${formattedAmount}`;
  }
};

/**
 * Get currency symbol from currency code
 * @param {string} currencyCode - Currency code (e.g., "USD", "EUR")
 * @param {Array} currencies - Array of currency objects
 * @returns {Object|null} Currency object with symbol and position, or null
 */
export const getCurrencyByCode = (currencyCode, currencies) => {
  if (!currencyCode || !currencies) return null;
  
  return currencies.find(currency => 
    currency.code === currencyCode.toUpperCase()
  ) || null;
};

/**
 * Format price with currency code (fallback when symbol not available)
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - Currency code
 * @returns {string} Formatted price string
 */
export const formatPriceWithCode = (amount, currencyCode) => {
  if (!amount && amount !== 0) return '';
  
  const formattedAmount = typeof amount === 'number' 
    ? amount.toLocaleString() 
    : parseFloat(amount).toLocaleString();
  
  return `${formattedAmount} ${currencyCode || 'XAF'}`;
}; 