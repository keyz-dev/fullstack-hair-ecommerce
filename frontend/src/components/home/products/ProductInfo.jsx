import ProductPrice from "./ProductPrice";

const ProductInfo = ({ name, price, originalPrice, currency, isOnSale, stock }) => {
    return (
      <div className="p-4 space-y-1">
        <h3 className="
          font-medium text-primary text-sm leading-tight
          line-clamp-2 group-hover:text-gray-700
          transition-colors duration-200
        ">  
          {name}
        </h3>
        
        <ProductPrice 
          price={price}
          originalPrice={originalPrice}
          currency={currency}
          isOnSale={isOnSale}
        />
        
        {/* Stock indicator */}
        {stock <= 5 && stock > 0 && (
          <p className="text-xs text-amber-600 font-medium mt-1">
            Only {stock} left in stock
          </p>
        )}
      </div>
    );
  };

  export default ProductInfo;