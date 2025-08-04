// Currency utilities - using external currency data instead of database model

// Common currencies with their symbols and positions
const SUPPORTED_CURRENCIES = {
  XAF: { symbol: 'XAF', name: 'Central African CFA Franc', position: 'after' },
  USD: { symbol: '$', name: 'US Dollar', position: 'before' },
  EUR: { symbol: '€', name: 'Euro', position: 'before' },
  GBP: { symbol: '£', name: 'British Pound', position: 'before' },
  NGN: { symbol: '₦', name: 'Nigerian Naira', position: 'before' },
  GHS: { symbol: '₵', name: 'Ghanaian Cedi', position: 'before' },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling', position: 'before' },
  ZAR: { symbol: 'R', name: 'South African Rand', position: 'before' },
  EGP: { symbol: 'E£', name: 'Egyptian Pound', position: 'before' },
  MAD: { symbol: 'MAD', name: 'Moroccan Dirham', position: 'after' },
  TND: { symbol: 'TND', name: 'Tunisian Dinar', position: 'after' },
  DZD: { symbol: 'DZD', name: 'Algerian Dinar', position: 'after' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', position: 'before' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', position: 'before' }
};

// Exchange rates: 1 unit of currency = X XAF
// These should be updated regularly with real-time rates
const EXCHANGE_RATES = {
  XAF: 1,
  USD: 625,    // 1 USD = 625 XAF
  EUR: 680,    // 1 EUR = 680 XAF
  GBP: 790,    // 1 GBP = 790 XAF
  NGN: 1.37,   // 1 NGN = 1.37 XAF
  GHS: 52.6,   // 1 GHS = 52.6 XAF
  KES: 4.17,   // 1 KES = 4.17 XAF
  ZAR: 34.5,   // 1 ZAR = 34.5 XAF
  EGP: 20.4,   // 1 EGP = 20.4 XAF
  MAD: 62.5,   // 1 MAD = 62.5 XAF
  TND: 200,    // 1 TND = 200 XAF
  DZD: 4.55,   // 1 DZD = 4.55 XAF
  CAD: 460,    // 1 CAD = 460 XAF
  AUD: 410,    // 1 AUD = 410 XAF
};

// Cache for exchange rates
let exchangeRatesCache = {};
let lastCacheUpdate = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Get all supported currencies
 */
const getSupportedCurrencies = () => {
  return Object.keys(SUPPORTED_CURRENCIES).map(code => ({
    code,
    ...SUPPORTED_CURRENCIES[code],
    isActive: true
  }));
};

/**
 * Get currency info by code
 */
const getCurrencyInfo = (currencyCode) => {
  if (!currencyCode) return null;
  const code = currencyCode.toUpperCase();
  return SUPPORTED_CURRENCIES[code] ? { code, ...SUPPORTED_CURRENCIES[code] } : null;
};

/**
 * Load exchange rates from external API (placeholder for real implementation)
 */
const loadExchangeRates = async () => {
  const now = Date.now();
  
  // Use cached rates if still valid
  if (exchangeRatesCache && Object.keys(exchangeRatesCache).length > 0 && (now - lastCacheUpdate) < CACHE_DURATION) {
    return exchangeRatesCache;
  }

  try {
    // TODO: Replace with actual exchange rate API call
    // Example: const response = await fetch('https://api.exchangerate-api.com/v4/latest/XAF');
    // const data = await response.json();
    // exchangeRatesCache = data.rates;
    
    // For now, use predefined rates
    exchangeRatesCache = { ...EXCHANGE_RATES };
    lastCacheUpdate = now;
    return exchangeRatesCache;
  } catch (error) {
    console.error('Error loading exchange rates:', error);
    // Use fallback rates
    return EXCHANGE_RATES;
  }
};

/**
 * Convert price from one currency to another
 */
const convertPrice = async (price, fromCurrency, toCurrency) => {
  if (!price || !fromCurrency || !toCurrency) return price;
  
  // If same currency, return original price
  if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) return price;
  
  try {
    const rates = await loadExchangeRates();
    
    // Convert to XAF first (base currency)
    const rateToXAF = rates[fromCurrency.toUpperCase()] || 1;
    const priceInXAF = price * rateToXAF;
    
    // Convert from XAF to target currency
    const rateFromXAF = rates[toCurrency.toUpperCase()] || 1;
    const convertedPrice = priceInXAF / rateFromXAF;
    
    return Math.round(convertedPrice * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error('Error converting price:', error);
    return price;
  }
};

/**
 * Format price with currency symbol
 */
const formatPrice = (price, currencyCode) => {
  if (!price) return '0';
  
  const currencyInfo = getCurrencyInfo(currencyCode);
  if (!currencyInfo) return `${price} ${currencyCode}`;
  
  const symbol = currencyInfo.symbol || currencyCode;
  const position = currencyInfo.position || 'before';
  
  // Format number with appropriate decimal places
  const formattedPrice = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
  
  return position === 'before' 
    ? `${symbol} ${formattedPrice}`
    : `${formattedPrice} ${symbol}`;
};

/**
 * Convert and format price for display
 */
const convertAndFormatPrice = async (price, fromCurrency, toCurrency) => {
  const convertedPrice = await convertPrice(price, fromCurrency, toCurrency);
  return formatPrice(convertedPrice, toCurrency);
};

/**
 * Validate currency code
 */
const isValidCurrency = (currencyCode) => {
  return currencyCode && SUPPORTED_CURRENCIES[currencyCode.toUpperCase()];
};

/**
 * Get exchange rates
 */
const getExchangeRates = async () => {
  return await loadExchangeRates();
};

/**
 * Refresh exchange rates cache
 */
const refreshExchangeRates = async () => {
  lastCacheUpdate = 0; // Force refresh
  return await loadExchangeRates();
};

module.exports = {
  getSupportedCurrencies,
  getCurrencyInfo,
  convertPrice,
  formatPrice,
  convertAndFormatPrice,
  isValidCurrency,
  getExchangeRates,
  refreshExchangeRates,
  SUPPORTED_CURRENCIES,
  EXCHANGE_RATES
}; 