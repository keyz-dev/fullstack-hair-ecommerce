import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onViewDetails, onAddToWishlist }) => {
  const { name, price, currency, images, stock, originalPrice } = product;
  
  // Format price with currency
  const formatPrice = (priceValue) => {
    if (currency && currency.symbol) {
      return currency.position === 'after' 
        ? `${priceValue} ${currency.symbol}`
        : `${currency.symbol} ${priceValue}`;
    }
    return `${priceValue}`;
  };

  // Get first image or placeholder
  const productImage = images && images.length > 0 ? images[0] : '/placeholder-product.jpg';
  
  // Stock status
  const isInStock = stock > 0;
  const isLowStock = stock > 0 && stock <= 5;
  
  // Check if product is on sale
  const isOnSale = originalPrice && originalPrice > price;
  const discountPercentage = isOnSale ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleCardClick = (e) => {
    // Don't trigger if clicking on action buttons
    if (e.target.closest('button')) {
      return;
    }
    onViewDetails(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    onAddToWishlist(product);
  };

  return (
    <div 
      className="group bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={productImage} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/placeholder-product.jpg';
          }}
        />
        
        {/* Badges */}
        {isOnSale && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded font-medium z-10">
            {discountPercentage}%
          </div>
        )}

        {!isInStock && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded font-medium z-10">
            Out of Stock
          </div>
        )}
        
        {isLowStock && isInStock && !isOnSale && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded font-medium z-10">
            Low Stock
          </div>
        )}

        {/* Quick action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleAddToWishlist}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
            title="Add to Wishlist"
          >
            <Heart size={14} className="text-gray-700" />
          </button>
          <button
            onClick={handleAddToCart}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
            title="Quick Add to Cart"
          >
            <ShoppingCart size={14} className="text-gray-700" />
          </button>
        </div>

        {/* ADD TO CART Overlay - Appears on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end justify-center pointer-events-none">
          <div className="w-full bg-black bg-opacity-80 text-white py-3 px-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-auto">
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={`w-full py-2 px-4 rounded font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                isInStock
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              <ShoppingCart size={16} />
              {isInStock ? 'ADD TO CART' : 'OUT OF STOCK'}
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-accent transition-colors">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(price)}
          </span>
          
          {isOnSale && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 