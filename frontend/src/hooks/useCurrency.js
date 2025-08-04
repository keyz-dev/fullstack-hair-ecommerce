import { useContext, useCallback, useEffect, useState } from 'react';
import { CurrencyContext } from '../contexts/CurrencyContext';

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }

  return context;
};

// Hook for converting and displaying prices
export const usePriceDisplay = () => {
  const { convertAndFormatPrice, formatPrice, userCurrency } = useCurrency();
  const [displayPrices, setDisplayPrices] = useState(new Map());

  // Convert and cache price for display
  const getDisplayPrice = useCallback(async (price, fromCurrency, toCurrency = userCurrency) => {
    if (!price || !fromCurrency) return '0';

    const cacheKey = `${price}-${fromCurrency}-${toCurrency}`;
    
    // Check cache first
    if (displayPrices.has(cacheKey)) {
      return displayPrices.get(cacheKey);
    }

    try {
      const formattedPrice = await convertAndFormatPrice(price, fromCurrency, toCurrency);
      setDisplayPrices(prev => new Map(prev).set(cacheKey, formattedPrice));
      return formattedPrice;
    } catch (error) {
      console.error('Error getting display price:', error);
      return formatPrice(price, fromCurrency);
    }
  }, [convertAndFormatPrice, formatPrice, userCurrency, displayPrices]);

  // Clear cache when currency changes
  useEffect(() => {
    const handleCurrencyChange = () => {
      setDisplayPrices(new Map());
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    window.addEventListener('exchangeRatesUpdated', handleCurrencyChange);

    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange);
      window.removeEventListener('exchangeRatesUpdated', handleCurrencyChange);
    };
  }, []);

  return { getDisplayPrice };
};

// Hook for product price display
export const useProductPrice = (product) => {
  const { getDisplayPrice } = usePriceDisplay();
  const [displayPrice, setDisplayPrice] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPrice = async () => {
      if (!product || !product.price || !product.currency) {
        setDisplayPrice('');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const price = await getDisplayPrice(product.price, product.currency);
        setDisplayPrice(price);
      } catch (error) {
        console.error('Error loading product price:', error);
        setDisplayPrice(`${product.price} ${product.currency}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrice();
  }, [product, getDisplayPrice]);

  return { displayPrice, isLoading };
};

// Hook for cart total calculation
export const useCartTotal = (cartItems) => {
  const { convertPrice, userCurrency } = useCurrency();
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateTotal = async () => {
      if (!cartItems || cartItems.length === 0) {
        setTotal(0);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        let totalAmount = 0;

        for (const item of cartItems) {
          const convertedPrice = await convertPrice(
            item.price || item.product?.price,
            item.currency || item.product?.currency,
            userCurrency
          );
          totalAmount += (convertedPrice * (item.quantity || 1));
        }

        setTotal(Math.round(totalAmount * 100) / 100);
      } catch (error) {
        console.error('Error calculating cart total:', error);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    calculateTotal();
  }, [cartItems, convertPrice, userCurrency]);

  return { total, isLoading };
};

// Hook for order total calculation
export const useOrderTotal = (orderItems) => {
  const { convertPrice, userCurrency } = useCurrency();
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateTotal = async () => {
      if (!orderItems || orderItems.length === 0) {
        setTotal(0);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        let totalAmount = 0;

        for (const item of orderItems) {
          const convertedPrice = await convertPrice(
            item.unitPrice,
            item.currency || 'XAF',
            userCurrency
          );
          totalAmount += (convertedPrice * (item.quantity || 1));
        }

        setTotal(Math.round(totalAmount * 100) / 100);
      } catch (error) {
        console.error('Error calculating order total:', error);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    calculateTotal();
  }, [orderItems, convertPrice, userCurrency]);

  return { total, isLoading };
};