export const formatPrice = (price, currency) => {
  if (currency && currency.symbol) {
    return currency.position === 'after' 
      ? `${price} ${currency.symbol}`
      : `${currency.symbol} ${price}`;
  }
  return `$${price}`;
}; 