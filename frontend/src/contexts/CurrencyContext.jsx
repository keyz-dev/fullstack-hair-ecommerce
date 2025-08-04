import React, { createContext, useState, useEffect, useCallback } from 'react';
import currencyService from '../services/currencyService';

const CurrencyContext = createContext();

const CurrencyProvider = ({ children }) => {
  const [userCurrency, setUserCurrency] = useState('XAF');
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize currency service
  const initializeCurrency = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await currencyService.initialize();
      
      setUserCurrency(currencyService.getUserCurrency());
      setAvailableCurrencies(currencyService.getAvailableCurrencies());
    } catch (err) {
      console.error('Error initializing currency:', err);
      setError('Failed to initialize currency system');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Convert price from one currency to another
  const convertPrice = useCallback(async (price, fromCurrency, toCurrency = userCurrency) => {
    if (!price || !fromCurrency || !toCurrency) return price;
    
    try {
      return await currencyService.convertPrice(price, fromCurrency, toCurrency);
    } catch (error) {
      console.error('Error converting price:', error);
      return price;
    }
  }, [userCurrency]);

  // Format price with currency symbol
  const formatPrice = useCallback((price, currency = userCurrency) => {
    if (!price) return '0';
    
    try {
      return currencyService.formatPrice(price, currency);
    } catch (error) {
      console.error('Error formatting price:', error);
      return `${price} ${currency}`;
    }
  }, [userCurrency]);

  // Convert and format price for display
  const convertAndFormatPrice = useCallback(async (price, fromCurrency, toCurrency = userCurrency) => {
    if (!price || !fromCurrency) return '0';
    
    try {
      return await currencyService.convertAndFormatPrice(price, fromCurrency, toCurrency);
    } catch (error) {
      console.error('Error converting and formatting price:', error);
      return formatPrice(price, fromCurrency);
    }
  }, [userCurrency, formatPrice]);

  // Change user currency
  const changeCurrency = useCallback(async (newCurrency) => {
    try {
      const success = currencyService.changeUserCurrency(newCurrency);
      if (success) {
        setUserCurrency(newCurrency);
        // Trigger a re-render of components that depend on currency
        window.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency: newCurrency } }));
      }
      return success;
    } catch (error) {
      console.error('Error changing currency:', error);
      return false;
    }
  }, []);

  // Get currency info
  const getCurrencyInfo = useCallback((currencyCode = userCurrency) => {
    return currencyService.getCurrencyInfo(currencyCode);
  }, [userCurrency]);

  // Refresh exchange rates
  const refreshRates = useCallback(async () => {
    try {
      await currencyService.loadExchangeRates();
      // Trigger a re-render of components that depend on exchange rates
      window.dispatchEvent(new CustomEvent('exchangeRatesUpdated'));
    } catch (error) {
      console.error('Error refreshing exchange rates:', error);
    }
  }, []);

  // Detect user zone and set appropriate currency
  const detectUserZone = useCallback(async () => {
    try {
      currencyService.detectUserCurrency();
      setUserCurrency(currencyService.getUserCurrency());
    } catch (error) {
      console.error('Error detecting user zone:', error);
    }
  }, []);

  // Load available currencies
  const loadAvailableCurrencies = useCallback(async () => {
    try {
      const currencies = currencyService.getAvailableCurrencies();
      setAvailableCurrencies(currencies);
    } catch (error) {
      console.error('Error loading currencies:', error);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeCurrency();
  }, [initializeCurrency]);

  const value = {
    // State
    userCurrency,
    availableCurrencies,
    isLoading,
    error,
    
    // Actions
    changeCurrency,
    convertPrice,
    formatPrice,
    convertAndFormatPrice,
    getCurrencyInfo,
    detectUserZone,
    loadAvailableCurrencies,
    refreshRates,
    initializeCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export { CurrencyContext, CurrencyProvider }; 