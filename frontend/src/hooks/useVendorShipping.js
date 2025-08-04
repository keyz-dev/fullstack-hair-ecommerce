import { useState, useEffect, useCallback } from 'react';
import { useCurrency } from './useCurrency';
import { 
  calculateMarketplaceShipping, 
  calculateVendorShipping,
  getVendorShippingProfiles,
  convertShippingCost 
} from '../services/shippingService';

export const useVendorShipping = (cartItems, shippingAddress) => {
  const { convertPrice, userCurrency } = useCurrency();
  const [marketplaceShipping, setMarketplaceShipping] = useState(null);
  const [convertedShippingCosts, setConvertedShippingCosts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate marketplace shipping when cart or address changes
  useEffect(() => {
    if (cartItems.length > 0 && shippingAddress?.city) {
      const shipping = calculateMarketplaceShipping(cartItems, shippingAddress);
      setMarketplaceShipping(shipping);
    } else {
      setMarketplaceShipping(null);
    }
  }, [cartItems, shippingAddress]);

  // Convert shipping costs to user's currency
  useEffect(() => {
    const convertCosts = async () => {
      if (!marketplaceShipping) {
        setConvertedShippingCosts({});
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const converted = {};
        
        for (const [vendorId, shipping] of Object.entries(marketplaceShipping.vendorShipping)) {
          const convertedCost = await convertShippingCost(
            shipping.cost, 
            shipping.currency || 'XAF', 
            userCurrency, 
            convertPrice
          );
          converted[vendorId] = convertedCost;
        }
        
        setConvertedShippingCosts(converted);
      } catch (err) {
        console.error('Error converting shipping costs:', err);
        setError('Failed to convert shipping costs');
        
        // Fallback to original costs
        const fallback = {};
        Object.entries(marketplaceShipping.vendorShipping).forEach(([vendorId, shipping]) => {
          fallback[vendorId] = shipping.cost;
        });
        setConvertedShippingCosts(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    convertCosts();
  }, [marketplaceShipping, convertPrice, userCurrency]);

  // Calculate total shipping cost
  const totalShippingCost = Object.values(convertedShippingCosts).reduce((sum, cost) => sum + cost, 0);

  // Get shipping info for a specific vendor
  const getVendorShipping = useCallback((vendorId) => {
    if (!marketplaceShipping?.vendorShipping[vendorId]) return null;
    
    return {
      ...marketplaceShipping.vendorShipping[vendorId],
      convertedCost: convertedShippingCosts[vendorId] || 0
    };
  }, [marketplaceShipping, convertedShippingCosts]);

  // Get all vendor shipping info
  const getAllVendorShipping = useCallback(() => {
    if (!marketplaceShipping) return [];
    
    return Object.entries(marketplaceShipping.vendorShipping).map(([vendorId, shipping]) => ({
      vendorId,
      ...shipping,
      convertedCost: convertedShippingCosts[vendorId] || 0
    }));
  }, [marketplaceShipping, convertedShippingCosts]);

  // Calculate shipping for a single vendor (useful for individual vendor pages)
  const calculateSingleVendorShipping = useCallback(async (vendorId, city, subtotal, vendorProfile = 'default') => {
    try {
      const shipping = calculateVendorShipping(vendorId, city, subtotal, vendorProfile);
      const convertedCost = await convertShippingCost(
        shipping.cost, 
        shipping.currency || 'XAF', 
        userCurrency, 
        convertPrice
      );
      
      return {
        ...shipping,
        convertedCost
      };
    } catch (err) {
      console.error('Error calculating single vendor shipping:', err);
      return null;
    }
  }, [convertPrice, userCurrency]);

  // Get available shipping profiles
  const getAvailableProfiles = useCallback(() => {
    return getVendorShippingProfiles();
  }, []);

  return {
    // State
    marketplaceShipping,
    convertedShippingCosts,
    totalShippingCost,
    isLoading,
    error,
    
    // Methods
    getVendorShipping,
    getAllVendorShipping,
    calculateSingleVendorShipping,
    getAvailableProfiles
  };
}; 