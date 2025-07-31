import React from 'react';
import { ShoppingCart, Heart, Eye, Star, Check } from 'lucide-react';

const ProductListItem = ({ 
  product, 
  onAddToCart, 
  onViewDetails, 
  onAddToWishlist,
  isInCart = false 
}) => {
  const { 
    name, 
    price, 
    originalPrice,
    currency, 
    images, 
    stock, 
    discount = 0, 
    rating = 0, 
    reviewCount = 0,
    isFeatured,
    tags = [],
    category,
    description,
    specifications = {}
  } = product;
  
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
  const isOnSale = discount > 0 || (originalPrice && originalPrice > price);

  // Format rating display
  const formatRating = (ratingValue) => {
    return ratingValue.toFixed(1);
  };

  // Get key specifications to display
  const getKeySpecs = () => {
    const specs = [];
    if (specifications.length) specs.push({ label: 'Length', value: specifications.length });
    if (specifications.warranty) specs.push({ label: 'Warranty', value: specifications.warranty });
    if (specifications.texture) specs.push({ label: 'Texture', value: specifications.texture });
    if (specifications.material) specs.push({ label: 'Material', value: specifications.material });
    if (specifications.weight) specs.push({ label: 'Weight', value: specifications.weight });
    if (specifications.density) specs.push({ label: 'Density', value: specifications.density });
    return specs.slice(0, 3); // Show max 3 specs like in the image
  };

  const keySpecs = getKeySpecs();

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

  const handleViewDetails = (e) => {
    e.stopPropagation();
    onViewDetails(product);
  };

  return (
    <div 
      className="group bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer flex min-h-48"
      onClick={handleCardClick}
    >
      {/* Product Image - Larger and center-aligned */}
      <div className="relative w-48 max-h-56 flex-shrink-0 overflow-hidden bg-gray-50 flex items-center justify-center my-auto">
        <img 
          src={productImage} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/placeholder-product.jpg';
          }}
        />
        
        {/* Badges */}
        {isFeatured && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-sm font-medium z-10">
            Featured
          </div>
        )}

        {isOnSale && !isFeatured && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-sm font-medium z-10">
            Sale
          </div>
        )}

        {!isInStock && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-sm font-medium z-10">
            Out of Stock
          </div>
        )}
        
        {isLowStock && isInStock && !isOnSale && !isFeatured && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-sm font-medium z-10">
            Low Stock
          </div>
        )}

        {/* Quick action buttons - centered on image */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
          <button
            onClick={handleViewDetails}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
            title="View Details"
          >
            <Eye size={16} className="text-gray-700" />
          </button>
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
            title="Add to Cart"
          >
            <ShoppingCart size={16} className="text-gray-700" />
          </button>
          <button
            onClick={handleAddToWishlist}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
            title="Add to Wishlist"
          >
            <Heart size={16} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex-1">
          {/* Category */}
          {category && (
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
              {category.name}
            </div>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-lg text-primary mb-3 hover:text-accent transition-colors line-clamp-1">
            {name}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {description}
            </p>
          )}

          {/* Specifications */}
          {keySpecs.length > 0 && (
            <div className="space-y-1 flex flex-wrap gap-2">
              {keySpecs.map((spec, index) => (
                <div key={index} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                  <span className="text-gray-500 font-medium">{spec.label}:</span>
                  <span className="text-gray-700 ml-1">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.floor(rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {formatRating(rating)} ({reviewCount})
              </span>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl text-primary">
              {formatPrice(price)}
            </span>
            {isOnSale && originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`flex items-center gap-2 px-6 py-3 rounded-sm font-medium transition-all duration-200 ${
              isInCart
                ? 'bg-green-500 text-white hover:bg-green-600'
                : isInStock
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            {isInCart ? (
              <>
                <Check size={18} />
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem; 