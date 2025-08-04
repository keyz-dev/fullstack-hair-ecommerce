const express = require('express');
const router = express.Router();
const { 
  getSupportedCurrencies, 
  getCurrencyInfo, 
  convertPrice, 
  formatPrice, 
  convertAndFormatPrice,
  getExchangeRates,
  refreshExchangeRates,
  isValidCurrency 
} = require('../utils/currencyUtils');

/**
 * GET /api/currency/supported
 * Get all supported currencies
 */
router.get('/supported', async (req, res) => {
  try {
    const currencies = getSupportedCurrencies();
    res.json({
      success: true,
      currencies
    });
  } catch (error) {
    console.error('Error getting supported currencies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get supported currencies'
    });
  }
});

/**
 * GET /api/currency/info/:code
 * Get currency info by code
 */
router.get('/info/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const currencyInfo = getCurrencyInfo(code);
    
    if (!currencyInfo) {
      return res.status(404).json({
        success: false,
        message: 'Currency not found'
      });
    }

    res.json({
      success: true,
      currency: currencyInfo
    });
  } catch (error) {
    console.error('Error getting currency info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get currency info'
    });
  }
});

/**
 * POST /api/currency/convert
 * Convert price from one currency to another
 */
router.post('/convert', async (req, res) => {
  try {
    const { price, fromCurrency, toCurrency } = req.body;

    if (!price || !fromCurrency || !toCurrency) {
      return res.status(400).json({
        success: false,
        message: 'Price, fromCurrency, and toCurrency are required'
      });
    }

    if (!isValidCurrency(fromCurrency) || !isValidCurrency(toCurrency)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid currency code'
      });
    }

    const convertedPrice = await convertPrice(price, fromCurrency, toCurrency);
    
    res.json({
      success: true,
      originalPrice: price,
      originalCurrency: fromCurrency,
      convertedPrice,
      targetCurrency: toCurrency
    });
  } catch (error) {
    console.error('Error converting price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to convert price'
    });
  }
});

/**
 * POST /api/currency/format
 * Format price with currency symbol
 */
router.post('/format', async (req, res) => {
  try {
    const { price, currency } = req.body;

    if (!price || !currency) {
      return res.status(400).json({
        success: false,
        message: 'Price and currency are required'
      });
    }

    if (!isValidCurrency(currency)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid currency code'
      });
    }

    const formattedPrice = formatPrice(price, currency);
    
    res.json({
      success: true,
      price,
      currency,
      formattedPrice
    });
  } catch (error) {
    console.error('Error formatting price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to format price'
    });
  }
});

/**
 * POST /api/currency/convert-and-format
 * Convert and format price for display
 */
router.post('/convert-and-format', async (req, res) => {
  try {
    const { price, fromCurrency, toCurrency } = req.body;

    if (!price || !fromCurrency || !toCurrency) {
      return res.status(400).json({
        success: false,
        message: 'Price, fromCurrency, and toCurrency are required'
      });
    }

    if (!isValidCurrency(fromCurrency) || !isValidCurrency(toCurrency)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid currency code'
      });
    }

    const formattedPrice = await convertAndFormatPrice(price, fromCurrency, toCurrency);
    
    res.json({
      success: true,
      originalPrice: price,
      originalCurrency: fromCurrency,
      formattedPrice,
      targetCurrency: toCurrency
    });
  } catch (error) {
    console.error('Error converting and formatting price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to convert and format price'
    });
  }
});

/**
 * GET /api/currency/rates
 * Get current exchange rates
 */
router.get('/rates', async (req, res) => {
  try {
    const rates = await getExchangeRates();
    res.json({
      success: true,
      rates,
      baseCurrency: 'XAF',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting exchange rates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get exchange rates'
    });
  }
});

/**
 * POST /api/currency/refresh-rates
 * Refresh exchange rates cache
 */
router.post('/refresh-rates', async (req, res) => {
  try {
    const rates = await refreshExchangeRates();
    res.json({
      success: true,
      rates,
      message: 'Exchange rates refreshed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error refreshing exchange rates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh exchange rates'
    });
  }
});

/**
 * POST /api/currency/validate
 * Validate currency code
 */
router.post('/validate', async (req, res) => {
  try {
    const { currency } = req.body;

    if (!currency) {
      return res.status(400).json({
        success: false,
        message: 'Currency code is required'
      });
    }

    const isValid = isValidCurrency(currency);
    const currencyInfo = isValid ? getCurrencyInfo(currency) : null;
    
    res.json({
      success: true,
      currency,
      isValid,
      currencyInfo
    });
  } catch (error) {
    console.error('Error validating currency:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate currency'
    });
  }
});

module.exports = router; 