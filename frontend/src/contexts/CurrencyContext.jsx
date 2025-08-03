import React, { createContext, useState, useEffect, useCallback } from 'react';
import { currencyApi } from '../api/currency';

const CurrencyContext = createContext();

// Default currencies for different zones
const ZONE_CURRENCIES = {
  'CM': 'XAF', // Cameroon
  'NG': 'NGN', // Nigeria
  'GH': 'GHS', // Ghana
  'KE': 'KES', // Kenya
  'ZA': 'ZAR', // South Africa
  'EG': 'EGP', // Egypt
  'MA': 'MAD', // Morocco
  'TN': 'TND', // Tunisia
  'DZ': 'DZD', // Algeria
  'US': 'USD', // United States
  'GB': 'GBP', // United Kingdom
  'EU': 'EUR', // European Union
  'CA': 'CAD', // Canada
  'AU': 'AUD', // Australia
  'default': 'XAF' // Default to XAF for BraidSter
};

// Exchange rates (you can integrate with a real API later)
const EXCHANGE_RATES = {
  XAF: 1,
  USD: 0.0016, // 1 XAF = 0.0016 USD
  EUR: 0.0015, // 1 XAF = 0.0015 EUR
  GBP: 0.0013, // 1 XAF = 0.0013 GBP
  NGN: 0.73,   // 1 XAF = 0.73 NGN
  GHS: 0.019,  // 1 XAF = 0.019 GHS
  KES: 0.24,   // 1 XAF = 0.24 KES
  ZAR: 0.029,  // 1 XAF = 0.029 ZAR
  EGP: 0.049,  // 1 XAF = 0.049 EGP
  MAD: 0.016,  // 1 XAF = 0.016 MAD
  TND: 0.005,  // 1 XAF = 0.005 TND
  DZD: 0.22,   // 1 XAF = 0.22 DZD
  CAD: 0.0022, // 1 XAF = 0.0022 CAD
  AUD: 0.0024, // 1 XAF = 0.0024 AUD
};

const CurrencyProvider = ({ children }) => {
  const [userCurrency, setUserCurrency] = useState('XAF');
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exchangeRates, setExchangeRates] = useState(EXCHANGE_RATES);

  // Detect user's zone and set appropriate currency
  const detectUserZone = useCallback(() => {
    try {
      // Try to get from localStorage first
      const storedCurrency = localStorage.getItem('userCurrency');
      if (storedCurrency) {
        setUserCurrency(storedCurrency);
        return;
      }

      // Try to detect from timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let detectedCurrency = 'XAF'; // Default

      // Map timezones to currencies
      if (timezone.includes('Africa/Douala') || timezone.includes('Africa/Lagos')) {
        detectedCurrency = 'XAF';
      } else if (timezone.includes('Africa/Lagos')) {
        detectedCurrency = 'NGN';
      } else if (timezone.includes('Africa/Accra')) {
        detectedCurrency = 'GHS';
      } else if (timezone.includes('Africa/Nairobi')) {
        detectedCurrency = 'KES';
      } else if (timezone.includes('Africa/Johannesburg')) {
        detectedCurrency = 'ZAR';
      } else if (timezone.includes('Africa/Cairo')) {
        detectedCurrency = 'EGP';
      } else if (timezone.includes('Africa/Casablanca')) {
        detectedCurrency = 'MAD';
      } else if (timezone.includes('Europe/')) {
        detectedCurrency = 'EUR';
      } else if (timezone.includes('America/')) {
        detectedCurrency = 'USD';
      } else if (timezone.includes('Australia/')) {
        detectedCurrency = 'AUD';
      }

      setUserCurrency(detectedCurrency);
      localStorage.setItem('userCurrency', detectedCurrency);
    } catch (error) {
      console.error('Error detecting user zone:', error);
      setUserCurrency('XAF');
    }
  }, []);

  // Load available currencies from API
  const loadAvailableCurrencies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await currencyApi.getActiveCurrencies();
      setAvailableCurrencies(response.currencies || []);
    } catch (error) {
      console.error('Error loading currencies:', error);
      // Fallback to basic currencies
      setAvailableCurrencies([
        { code: 'XAF', symbol: 'XAF', name: 'Central African CFA Franc', isActive: true },
        { code: 'USD', symbol: '$', name: 'US Dollar', isActive: true },
        { code: 'EUR', symbol: '€', name: 'Euro', isActive: true },
        { code: 'GBP', symbol: '£', name: 'British Pound', isActive: true },
        { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', isActive: true },
        { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', isActive: true },
        { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', isActive: true },
        { code: 'ZAR', symbol: 'R', name: 'South African Rand', isActive: true },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Convert price from one currency to another
  const convertPrice = useCallback((price, fromCurrency, toCurrency = userCurrency) => {
    if (!price || !fromCurrency || !toCurrency) return price;
    
    // If same currency, return original price
    if (fromCurrency === toCurrency) return price;
    
    // Convert to XAF first (base currency)
    const rateToXAF = exchangeRates[fromCurrency] || 1;
    const priceInXAF = price / rateToXAF;
    
    // Convert from XAF to target currency
    const rateFromXAF = exchangeRates[toCurrency] || 1;
    const convertedPrice = priceInXAF * rateFromXAF;
    
    return Math.round(convertedPrice * 100) / 100; // Round to 2 decimal places
  }, [userCurrency, exchangeRates]);

  // Format price with currency symbol
  const formatPrice = useCallback((price, currency = userCurrency) => {
    if (!price) return '0';
    
    const currencyInfo = availableCurrencies.find(c => c.code === currency);
    if (!currencyInfo) return `${price} ${currency}`;
    
    const symbol = currencyInfo.symbol || currency;
    const position = currencyInfo.position || 'after';
    
    // Format number with appropriate decimal places
    const formattedPrice = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
    
    return position === 'before' 
      ? `${symbol} ${formattedPrice}`
      : `${formattedPrice} ${symbol}`;
  }, [userCurrency, availableCurrencies]);

  // Change user currency
  const changeCurrency = useCallback((newCurrency) => {
    setUserCurrency(newCurrency);
    localStorage.setItem('userCurrency', newCurrency);
  }, []);

  // Get currency info
  const getCurrencyInfo = useCallback((currencyCode = userCurrency) => {
    return availableCurrencies.find(c => c.code === currencyCode) || {
      code: currencyCode,
      symbol: currencyCode,
      name: currencyCode,
      isActive: true
    };
  }, [userCurrency, availableCurrencies]);

  // Initialize on mount
  useEffect(() => {
    detectUserZone();
    loadAvailableCurrencies();
  }, [detectUserZone, loadAvailableCurrencies]);

  const value = {
    // State
    userCurrency,
    availableCurrencies,
    loading,
    exchangeRates,
    
    // Actions
    changeCurrency,
    convertPrice,
    formatPrice,
    getCurrencyInfo,
    detectUserZone,
    loadAvailableCurrencies,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export { CurrencyContext, CurrencyProvider }; 