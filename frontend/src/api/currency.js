// Currency API - using backend endpoints for real-time currency operations

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/v2/api';

// Create axios instance for currency API
const currencyApiClient = axios.create({
  baseURL: `${API_BASE_URL}/currency`,
  timeout: 10000,
});

// Request interceptor to add auth token if available
currencyApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
currencyApiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('Currency API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const currencyApi = {
  // Get all supported currencies
  getAllCurrencies: async () => {
    try {
      return await currencyApiClient.get('/supported');
    } catch (error) {
      console.error('Error getting currencies:', error);
      // Fallback to predefined currencies
      return {
        success: true,
        currencies: [
          { code: 'XAF', symbol: 'XAF', name: 'Central African CFA Franc', position: 'after', isActive: true },
          { code: 'USD', symbol: '$', name: 'US Dollar', position: 'before', isActive: true },
          { code: 'EUR', symbol: '€', name: 'Euro', position: 'before', isActive: true },
          { code: 'GBP', symbol: '£', name: 'British Pound', position: 'before', isActive: true },
          { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', position: 'before', isActive: true },
          { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', position: 'before', isActive: true },
          { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', position: 'before', isActive: true },
          { code: 'ZAR', symbol: 'R', name: 'South African Rand', position: 'before', isActive: true },
          { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', position: 'before', isActive: true },
          { code: 'MAD', symbol: 'MAD', name: 'Moroccan Dirham', position: 'after', isActive: true },
          { code: 'TND', symbol: 'TND', name: 'Tunisian Dinar', position: 'after', isActive: true },
          { code: 'DZD', symbol: 'DZD', name: 'Algerian Dinar', position: 'after', isActive: true },
          { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', position: 'before', isActive: true },
          { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', position: 'before', isActive: true }
        ]
      };
    }
  },

  // Get active currencies (same as getAllCurrencies for now)
  getActiveCurrencies: async () => {
    return await currencyApi.getAllCurrencies();
  },

  // Get currency by code
  getCurrencyByCode: async (code) => {
    try {
      return await currencyApiClient.get(`/info/${code}`);
    } catch (error) {
      console.error('Error getting currency by code:', error);
      throw new Error('Currency not found');
    }
  },

  // Convert price from one currency to another
  convertPrice: async (price, fromCurrency, toCurrency) => {
    try {
      return await currencyApiClient.post('/convert', {
        price,
        fromCurrency,
        toCurrency
      });
    } catch (error) {
      console.error('Error converting price:', error);
      throw error;
    }
  },

  // Format price with currency symbol
  formatPrice: async (price, currency) => {
    try {
      return await currencyApiClient.post('/format', {
        price,
        currency
      });
    } catch (error) {
      console.error('Error formatting price:', error);
      throw error;
    }
  },

  // Convert and format price for display
  convertAndFormatPrice: async (price, fromCurrency, toCurrency) => {
    try {
      return await currencyApiClient.post('/convert-and-format', {
        price,
        fromCurrency,
        toCurrency
      });
    } catch (error) {
      console.error('Error converting and formatting price:', error);
      throw error;
    }
  },

  // Get current exchange rates
  getExchangeRates: async () => {
    try {
      return await currencyApiClient.get('/rates');
    } catch (error) {
      console.error('Error getting exchange rates:', error);
      throw error;
    }
  },

  // Refresh exchange rates
  refreshExchangeRates: async () => {
    try {
      return await currencyApiClient.post('/refresh-rates');
    } catch (error) {
      console.error('Error refreshing exchange rates:', error);
      throw error;
    }
  },

  // Validate currency code
  validateCurrency: async (currency) => {
    try {
      return await currencyApiClient.post('/validate', { currency });
    } catch (error) {
      console.error('Error validating currency:', error);
      throw error;
    }
  },

  // Get currency info (synchronous version for fallback)
  getCurrencyInfo: (code) => {
    const currencies = {
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
    
    const currency = currencies[code?.toUpperCase()];
    if (!currency) return null;
    return { code: code.toUpperCase(), ...currency, isActive: true };
  }
};

// Legacy exports for backward compatibility
export const SUPPORTED_CURRENCIES = {
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

export const EXCHANGE_RATES = {
  XAF: 1,
  USD: 625,
  EUR: 680,
  GBP: 790,
  NGN: 1.37,
  GHS: 52.6,
  KES: 4.17,
  ZAR: 34.5,
  EGP: 20.4,
  MAD: 62.5,
  TND: 200,
  DZD: 4.55,
  CAD: 460,
  AUD: 410
};

const ZONE_CURRENCIES = {
  'CM': 'XAF',
  'NG': 'NGN',
  'GH': 'GHS',
  'KE': 'KES',
  'ZA': 'ZAR',
  'EG': 'EGP',
  'MA': 'MAD',
  'TN': 'TND',
  'DZ': 'DZD',
  'US': 'USD',
  'GB': 'GBP',
  'EU': 'EUR',
  'CA': 'CAD',
  'AU': 'AUD',
  'default': 'XAF'
}; 