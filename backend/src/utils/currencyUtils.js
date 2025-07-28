const Currency = require('../models/currency');

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {number} - Converted amount
 */
const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const fromCurrencyData = await Currency.findOne({ code: fromCurrency.toUpperCase() });
  const toCurrencyData = await Currency.findOne({ code: toCurrency.toUpperCase() });

  if (!fromCurrencyData || !toCurrencyData) {
    throw new Error('Currency not found');
  }

  // Convert to base currency first, then to target currency
  const baseAmount = amount / fromCurrencyData.exchangeRate;
  const convertedAmount = baseAmount * toCurrencyData.exchangeRate;

  return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
};

/**
 * Format price with currency symbol
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code
 * @param {Object} currencyData - Currency data object (optional, will fetch if not provided)
 * @returns {string} - Formatted price string
 */
const formatPrice = async (amount, currencyCode, currencyData = null) => {
  let currency = currencyData;
  
  if (!currency) {
    currency = await Currency.findOne({ code: currencyCode.toUpperCase() });
    if (!currency) {
      throw new Error('Currency not found');
    }
  }

  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return currency.position === 'before' 
    ? `${currency.symbol}${formattedAmount}`
    : `${formattedAmount}${currency.symbol}`;
};

/**
 * Get base currency
 * @returns {Object} - Base currency object
 */
const getBaseCurrency = async () => {
  const baseCurrency = await Currency.findOne({ isBase: true });
  if (!baseCurrency) {
    throw new Error('Base currency not found');
  }
  return baseCurrency;
};

/**
 * Get all active currencies
 * @returns {Array} - Array of active currency objects
 */
const getActiveCurrencies = async () => {
  return await Currency.find({ isActive: true }).sort({ isBase: -1, code: 1 });
};

/**
 * Validate currency code
 * @param {string} currencyCode - Currency code to validate
 * @returns {boolean} - Whether currency code is valid
 */
const isValidCurrency = async (currencyCode) => {
  const currency = await Currency.findOne({ 
    code: currencyCode.toUpperCase(),
    isActive: true 
  });
  return !!currency;
};

module.exports = {
  convertCurrency,
  formatPrice,
  getBaseCurrency,
  getActiveCurrencies,
  isValidCurrency,
}; 