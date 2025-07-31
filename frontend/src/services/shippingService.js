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

export const calculateShipping = (city, subtotal) => {
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

  const zoneData = shippingZones[zone];
  
  // Check if order qualifies for free shipping
  if (subtotal >= zoneData.freeShippingThreshold) {
    return {
      cost: 0,
      zone: zoneData.name,
      deliveryTime: zoneData.deliveryTime,
      isFree: true
    };
  }

  return {
    cost: zoneData.baseRate,
    zone: zoneData.name,
    deliveryTime: zoneData.deliveryTime,
    isFree: false
  };
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