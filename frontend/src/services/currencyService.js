import Currency from "currency.js";
import { currencyApi } from "../api/currency";

// Currency configuration for different currencies
const CURRENCY_CONFIGS = {
  XAF: { symbol: "XAF", precision: 0, pattern: "# !" },
  USD: {
    symbol: "$",
    precision: 2,
    pattern: "!#",
    decimal: ".",
    separator: ",",
  },
  EUR: {
    symbol: "€",
    precision: 2,
    pattern: "!#",
    decimal: ".",
    separator: ",",
  },
  GBP: {
    symbol: "£",
    precision: 2,
    pattern: "!#",
    decimal: ".",
    separator: ",",
  },
  NGN: {
    symbol: "₦",
    precision: 2,
    pattern: "!#",
    decimal: ".",
    separator: ",",
  },
  GHS: {
    symbol: "₵",
    precision: 2,
    pattern: "!#",
    decimal: ".",
    separator: ",",
  },
  KES: {
    symbol: "KSh",
    precision: 2,
    pattern: "!#",
    decimal: ".",
    separator: ",",
  },
  ZAR: {
    symbol: "R",
    precision: 2,
    pattern: "!#",
    decimal: ".",
    separator: ",",
  },
  EGP: {
    symbol: "E£",
    precision: 2,
    pattern: "!#",
    decimal: ".",
    separator: ",",
  },
  MAD: {
    symbol: "MAD",
    precision: 2,
    pattern: "# !",
    decimal: ".",
    separator: ",",
  },
  TND: {
    symbol: "TND",
    precision: 3,
    pattern: "# !",
    decimal: ".",
    separator: ",",
  },
  DZD: {
    symbol: "DZD",
    precision: 2,
    pattern: "# !",
    decimal: ".",
    separator: ",",
  },
  CAD: {
    symbol: "C$",
    precision: 2,
    pattern: "!#",
    decimal: ".",
    separator: ",",
  },
  AUD: {
    symbol: "A$",
    precision: 2,
    pattern: "!#",
    decimal: ".",
    separator: ",",
  },
};

// Cache for exchange rates
let exchangeRatesCache = {};
let lastCacheUpdate = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

class CurrencyService {
  constructor() {
    this.baseCurrency = "XAF";
    this.userCurrency = "XAF";
    this.availableCurrencies = [];
    this.isInitialized = false;
  }

  /**
   * Initialize the currency service
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load available currencies
      const response = await currencyApi.getActiveCurrencies();
      this.availableCurrencies = response.currencies || [];

      // Load exchange rates
      await this.loadExchangeRates();

      // Detect user currency
      this.detectUserCurrency();

      this.isInitialized = true;
    } catch (error) {
      console.error("Error initializing currency service:", error);
      // Fallback to basic setup
      this.setupFallback();
    }
  }

  /**
   * Load exchange rates from API or cache
   */
  async loadExchangeRates() {
    const now = Date.now();

    // Use cached rates if still valid
    if (exchangeRatesCache && now - lastCacheUpdate < CACHE_DURATION) {
      return exchangeRatesCache;
    }

    try {
      // Try to get real-time rates (you can replace this with your preferred API)
      const rates = await this.fetchExchangeRates();
      exchangeRatesCache = rates;
      lastCacheUpdate = now;
      return rates;
    } catch (error) {
      console.error("Error loading exchange rates:", error);
      // Use fallback rates
      return this.getFallbackRates();
    }
  }

  /**
   * Fetch exchange rates from external API
   */
  async fetchExchangeRates() {
    // You can replace this with your preferred exchange rate API
    // For now, using the predefined rates from your currency.js
    const { EXCHANGE_RATES } = await import("../api/currency");
    return EXCHANGE_RATES;
  }

  /**
   * Get fallback exchange rates
   */
  getFallbackRates() {
    return {
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
      AUD: 410,
    };
  }

  /**
   * Detect user's currency based on timezone and localStorage
   */
  detectUserCurrency() {
    try {
      // Check localStorage first
      const storedCurrency = localStorage.getItem("userCurrency");
      if (storedCurrency && this.isValidCurrency(storedCurrency)) {
        this.userCurrency = storedCurrency;
        return;
      }

      // Detect from timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const detectedCurrency = this.detectCurrencyFromTimezone(timezone);

      if (this.isValidCurrency(detectedCurrency)) {
        this.userCurrency = detectedCurrency;
        localStorage.setItem("userCurrency", detectedCurrency);
        console.log(
          "Detected currency from timezone:",
          detectedCurrency,
          "from timezone:",
          timezone
        );
      } else {
        console.log("Using default currency XAF");
        this.userCurrency = "XAF";
      }
    } catch (error) {
      console.error("Error detecting user currency:", error);
      this.userCurrency = "XAF";
    }
  }

  /**
   * Detect currency from timezone
   */
  detectCurrencyFromTimezone(timezone) {
    const timezoneMap = {
      "Africa/Douala": "XAF",
      "Africa/Lagos": "NGN",
      "Africa/Accra": "GHS",
      "Africa/Nairobi": "KES",
      "Africa/Johannesburg": "ZAR",
      "Africa/Cairo": "EGP",
      "Africa/Casablanca": "MAD",
      "Europe/": "EUR",
      "America/": "USD",
      "Australia/": "AUD",
    };

    for (const [pattern, currency] of Object.entries(timezoneMap)) {
      if (timezone.includes(pattern)) {
        return currency;
      }
    }

    return "XAF"; // Default
  }

  /**
   * Convert price from one currency to another
   */
  async convertPrice(price, fromCurrency, toCurrency = this.userCurrency) {
    if (!price) return 0;

    // Ensure currencies are valid
    if (!fromCurrency || typeof fromCurrency !== "string") {
      fromCurrency = "XAF";
    }
    if (!toCurrency || typeof toCurrency !== "string") {
      toCurrency = "XAF";
    }

    // If same currency, return original price
    if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) return price;

    try {
      const rates = await this.loadExchangeRates();

      // Convert to base currency (XAF) first
      const rateToBase = rates[fromCurrency.toUpperCase()] || 1;
      const priceInBase = price * rateToBase;

      // Convert from base currency to target currency
      const rateFromBase = rates[toCurrency.toUpperCase()] || 1;
      const convertedPrice = priceInBase / rateFromBase;

      return Math.round(convertedPrice * 100) / 100;
    } catch (error) {
      console.error("Error converting price:", error);
      return price;
    }
  }

  /**
   * Format price with currency symbol using currency.js
   */
  formatPrice(price, currencyCode = this.userCurrency) {
    if (!price && price !== 0) return "0";

    // Ensure currencyCode is valid
    if (!currencyCode || typeof currencyCode !== "string") {
      currencyCode = "XAF"; // Default fallback
      console.log("Currency code was invalid, using default XAF");
    }

    const config = CURRENCY_CONFIGS[currencyCode.toUpperCase()];
    if (!config) {
      // Fallback to basic formatting with currency code
      console.log(
        "No config found for currency:",
        currencyCode,
        "using fallback formatting"
      );
      return `${price} ${currencyCode}`;
    }

    try {
      const currency = new Currency(price, config);
      return currency.format();
    } catch (error) {
      console.error("Error formatting price:", error);
      // Fallback to basic formatting with currency code
      return `${price} ${currencyCode}`;
    }
  }

  /**
   * Convert and format price for display
   */
  async convertAndFormatPrice(
    price,
    fromCurrency,
    toCurrency = this.userCurrency
  ) {
    // Ensure currencies are valid
    if (!fromCurrency || typeof fromCurrency !== "string") {
      fromCurrency = "XAF";
    }
    if (!toCurrency || typeof toCurrency !== "string") {
      toCurrency = "XAF";
    }

    const convertedPrice = await this.convertPrice(
      price,
      fromCurrency,
      toCurrency
    );
    return this.formatPrice(convertedPrice, toCurrency);
  }

  /**
   * Change user currency
   */
  changeUserCurrency(newCurrency) {
    if (this.isValidCurrency(newCurrency)) {
      this.userCurrency = newCurrency;
      localStorage.setItem("userCurrency", newCurrency);
      return true;
    }
    return false;
  }

  /**
   * Get currency info
   */
  getCurrencyInfo(currencyCode = this.userCurrency) {
    return (
      this.availableCurrencies.find(
        (c) => c.code === currencyCode.toUpperCase()
      ) || {
        code: currencyCode,
        symbol: currencyCode,
        name: currencyCode,
        isActive: true,
      }
    );
  }

  /**
   * Validate currency code
   */
  isValidCurrency(currencyCode) {
    return (
      currencyCode &&
      this.availableCurrencies.some(
        (c) => c.code === currencyCode.toUpperCase()
      )
    );
  }

  /**
   * Get all available currencies
   */
  getAvailableCurrencies() {
    return this.availableCurrencies;
  }

  /**
   * Setup fallback configuration
   */
  setupFallback() {
    this.availableCurrencies = [
      {
        code: "XAF",
        symbol: "XAF",
        name: "Central African CFA Franc",
        position: "after",
        isActive: true,
      },
      {
        code: "USD",
        symbol: "$",
        name: "US Dollar",
        position: "before",
        isActive: true,
      },
      {
        code: "EUR",
        symbol: "€",
        name: "Euro",
        position: "before",
        isActive: true,
      },
      {
        code: "GBP",
        symbol: "£",
        name: "British Pound",
        position: "before",
        isActive: true,
      },
    ];
    this.userCurrency = "XAF";
  }

  /**
   * Get current user currency
   */
  getUserCurrency() {
    return this.userCurrency;
  }

  /**
   * Get base currency
   */
  getBaseCurrency() {
    return this.baseCurrency;
  }
}

// Create singleton instance
const currencyService = new CurrencyService();

export default currencyService;
