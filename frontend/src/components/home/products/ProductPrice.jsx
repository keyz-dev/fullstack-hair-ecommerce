const ProductPrice = ({ price, originalPrice, currency, isOnSale }) => {
    const formatPrice = (priceValue) => {
      if (!currency) return `${priceValue}`;
      
      const formattedPrice = typeof priceValue === 'number' 
        ? priceValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : priceValue;
      
      return currency.position === 'after' 
        ? `${formattedPrice} ${currency.symbol}`
        : `${currency.symbol} ${formattedPrice}`;
    };
  
    return (
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-lg font-bold text-gray-900 tracking-tight">
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