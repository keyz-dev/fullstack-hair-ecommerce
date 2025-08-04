const ProductPrice = ({ price, originalPrice, currency, isOnSale }) => {
    const formatPrice = (priceValue) => {
      if (!currency) return `${priceValue}`;
      
      const formattedPrice = typeof priceValue === 'number' 
        ? priceValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : priceValue;
      
      // Handle both currency objects and currency codes
      if (typeof currency === 'object' && currency.position && currency.symbol) {
        return currency.position === 'after' 
          ? `${formattedPrice} ${currency.symbol}`
          : `${currency.symbol} ${formattedPrice}`;
      } else if (typeof currency === 'string') {
        // Handle currency code string
        return `${formattedPrice} ${currency}`;
      } else {
        // Fallback
        return `${formattedPrice}`;
      }
    };
  
    return (
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-lg font-bold text-primary tracking-tight">
          {formatPrice(price)}
        </span>
        
        {isOnSale && originalPrice && (
          <span className="text-sm text-gray-500 line-through font-medium">
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>
    );
  };

  export default ProductPrice;