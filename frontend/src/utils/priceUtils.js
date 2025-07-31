export const formatPrice = (price, currency) => {
  // Handle currency as object with symbol and position
  if (currency && typeof currency === 'object' && currency.symbol) {
    return currency.position === 'after' 
      ? `${price} ${currency.symbol}`
      : `${currency.symbol} ${price}`;
  }
  
  // Handle currency as string (symbol only)
  if (currency && typeof currency === 'string') {
    return `${currency} ${price}`;
  }
  
  // Default fallback
  return `$${price}`;
}; 