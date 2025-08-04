// Shipping zones and rates for Cameroon
export const shippingZones = {
  'douala': {
    name: 'Douala',
    baseRate: 1000,
    freeShippingThreshold: 50000,
    deliveryTime: '1-2 business days'
  },
  'yaounde': {
    name: 'Yaoundé',
    baseRate: 1500,
    freeShippingThreshold: 50000,
    deliveryTime: '1-2 business days'
  },
  'bamenda': {
    name: 'Bamenda',
    baseRate: 2000,
    freeShippingThreshold: 75000,
    deliveryTime: '2-3 business days'
  },
  'buea': {
    name: 'Buea',
    baseRate: 1800,
    freeShippingThreshold: 75000,
    deliveryTime: '2-3 business days'
  },
  'kribi': {
    name: 'Kribi',
    baseRate: 2200,
    freeShippingThreshold: 75000,
    deliveryTime: '2-3 business days'
  },
  'garoua': {
    name: 'Garoua',
    baseRate: 2500,
    freeShippingThreshold: 100000,
    deliveryTime: '3-4 business days'
  },
  'maroua': {
    name: 'Maroua',
    baseRate: 3000,
    freeShippingThreshold: 100000,
    deliveryTime: '3-4 business days'
  },
  'other': {
    name: 'Other Cities',
    baseRate: 3500,
    freeShippingThreshold: 150000,
    deliveryTime: '4-5 business days'
  }
};

// Vendor shipping profiles - each vendor can have their own shipping rates
export const vendorShippingProfiles = {
  'default': {
    name: 'Standard Shipping',
    zones: shippingZones,
    currency: 'XAF',
    freeShippingThreshold: 50000,
    processingTime: '1-2 business days'
  },
  'premium': {
    name: 'Premium Vendor',
    zones: {
      ...shippingZones,
      'douala': { ...shippingZones.douala, baseRate: 800, freeShippingThreshold: 40000 },
      'yaounde': { ...shippingZones.yaounde, baseRate: 1200, freeShippingThreshold: 40000 },
      'other': { ...shippingZones.other, baseRate: 2800, freeShippingThreshold: 120000 }
    },
    currency: 'XAF',
    freeShippingThreshold: 40000,
    processingTime: 'Same day processing'
  },
  'budget': {
    name: 'Budget Vendor',
    zones: {
      ...shippingZones,
      'douala': { ...shippingZones.douala, baseRate: 1200, freeShippingThreshold: 60000 },
      'yaounde': { ...shippingZones.yaounde, baseRate: 1800, freeShippingThreshold: 60000 },
      'other': { ...shippingZones.other, baseRate: 4200, freeShippingThreshold: 180000 }
    },
    currency: 'XAF',
    freeShippingThreshold: 60000,
    processingTime: '2-3 business days'
  }
};

// Calculate shipping for a single vendor
export const calculateVendorShipping = (vendorId, city, subtotal, vendorProfile = 'default') => {
  const profile = vendorShippingProfiles[vendorProfile] || vendorShippingProfiles.default;
  const normalizedCity = city?.toLowerCase().trim();
  let zone = 'other';

  // Determine shipping zone based on city
  if (normalizedCity?.includes('douala')) {
    zone = 'douala';
  } else if (normalizedCity?.includes('yaounde') || normalizedCity?.includes('yaoundé')) {
    zone = 'yaounde';
  } else if (normalizedCity?.includes('bamenda')) {
    zone = 'bamenda';
  } else if (normalizedCity?.includes('buea')) {
    zone = 'buea';
  } else if (normalizedCity?.includes('kribi')) {
    zone = 'kribi';
  } else if (normalizedCity?.includes('garoua')) {
    zone = 'garoua';
  } else if (normalizedCity?.includes('maroua')) {
    zone = 'maroua';
  }

  const zoneData = profile.zones[zone];
  
  // Check if order qualifies for free shipping
  if (subtotal >= zoneData.freeShippingThreshold) {
    return {
      cost: 0,
      zone: zoneData.name,
      deliveryTime: zoneData.deliveryTime,
      isFree: true,
      vendorId,
      vendorProfile: profile.name,
      processingTime: profile.processingTime,
      currency: profile.currency
    };
  }

  return {
    cost: zoneData.baseRate,
    zone: zoneData.name,
    deliveryTime: zoneData.deliveryTime,
    isFree: false,
    vendorId,
    vendorProfile: profile.name,
    processingTime: profile.processingTime,
    currency: profile.currency
  };
};

// Calculate shipping for multiple vendors (marketplace scenario)
export const calculateMarketplaceShipping = (cartItems, shippingAddress) => {
  // Group items by vendor
  const vendorGroups = {};
  
  cartItems.forEach(item => {
    const vendorId = item.vendorId || 'default';
    if (!vendorGroups[vendorId]) {
      vendorGroups[vendorId] = {
        items: [],
        subtotal: 0,
        vendorProfile: item.vendorProfile || 'default'
      };
    }
    vendorGroups[vendorId].items.push(item);
    vendorGroups[vendorId].subtotal += (item.price * item.quantity);
  });

  // Calculate shipping for each vendor
  const vendorShipping = {};
  let totalShippingCost = 0;
  let estimatedDeliveryTime = '';

  Object.entries(vendorGroups).forEach(([vendorId, group]) => {
    const shipping = calculateVendorShipping(
      vendorId, 
      shippingAddress?.city, 
      group.subtotal, 
      group.vendorProfile
    );
    
    vendorShipping[vendorId] = {
      ...shipping,
      items: group.items,
      subtotal: group.subtotal
    };
    
    totalShippingCost += shipping.cost;
    
    // Use the longest delivery time as estimate
    if (!estimatedDeliveryTime || shipping.deliveryTime > estimatedDeliveryTime) {
      estimatedDeliveryTime = shipping.deliveryTime;
    }
  });

  return {
    vendorShipping,
    totalShippingCost,
    estimatedDeliveryTime,
    vendorCount: Object.keys(vendorGroups).length
  };
};

// Legacy function for backward compatibility
export const calculateShipping = (city, subtotal) => {
  return calculateVendorShipping('default', city, subtotal, 'default');
};

export const getShippingZones = () => {
  return Object.entries(shippingZones).map(([key, zone]) => ({
    id: key,
    name: zone.name,
    baseRate: zone.baseRate,
    freeShippingThreshold: zone.freeShippingThreshold,
    deliveryTime: zone.deliveryTime
  }));
};

// Get available vendor shipping profiles
export const getVendorShippingProfiles = () => {
  return Object.entries(vendorShippingProfiles).map(([key, profile]) => ({
    id: key,
    name: profile.name,
    currency: profile.currency,
    freeShippingThreshold: profile.freeShippingThreshold,
    processingTime: profile.processingTime
  }));
};

// Calculate shipping cost in different currencies
export const convertShippingCost = async (cost, fromCurrency, toCurrency, convertPrice) => {
  try {
    if (cost === 0) return 0;
    return await convertPrice(cost, fromCurrency, toCurrency);
  } catch (error) {
    console.error('Error converting shipping cost:', error);
    return cost; // Fallback to original cost
  }
}; 