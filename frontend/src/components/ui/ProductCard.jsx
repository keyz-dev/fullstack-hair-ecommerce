import React from 'react';
import { ShoppingCart, Heart, Star, Tag, Check } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';

const ProductCard = ({ product, onAddToCart, onViewDetails, onAddToWishlist, viewMode = 'grid', isInCart = false }) => {
  const { convertPrice, formatPrice } = useCurrency();
  
  const { 
    name, 
    price, 
    currency, 
    images, 
    stock, 
    discount = 0, 
    rating = 0, 
    reviewCount = 0,
    isOnSale: productIsOnSale,
    isFeatured,
    tags = [],
    specifications = {}
  } = product;
  
  // Convert price to user's preferred currency
  const convertedPrice = convertPrice(price, currency);
  const formattedPrice = formatPrice(convertedPrice);
  
  // Calculate discounted price
  const discountedPrice = discount > 0 ? convertedPrice * (1 - discount / 100) : convertedPrice;
  const formattedDiscountedPrice = formatPrice(discountedPrice);

  // Get first image or placeholder
  const productImage = images && images.length > 0 ? images[0] : '/placeholder-product.jpg';
  
  // Stock status
  const isInStock = stock > 0;
  const isLowStock = stock > 0 && stock <= 5;
  
  // Check if product is on sale
  const isOnSale = discount > 0;
  const discountPercentage = discount;

  // Format rating display
  const formatRating = (ratingValue) => {
    return ratingValue.toFixed(1);
  };

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
      className={`group bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer ${
        viewMode === 'list' ? 'flex' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className={`relative overflow-hidden bg-gray-50 ${
        viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'
      }`}>
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
            {discountPercentage}% OFF
          </div>
        )}

        {isFeatured && !isOnSale && (
          <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium z-10">
            Featured
          </div>
        )}

        {!isInStock && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded font-medium z-10">
            Out of Stock
          </div>
        )}
        
        {isLowStock && isInStock && !isOnSale && !isFeatured && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded font-medium z-10">
            Low Stock
          </div>
        )}

        {/* In Cart Badge */}
        {isInCart && (
          <div className="absolute top-3 left-3 z-20 bg-green-500 text-white rounded-full p-1 shadow-lg">
            <Check size={16} />
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
                isInCart
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : isInStock
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {isInCart ? (
                <>
                  <Check size={16} />
                  ADDED
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  {isInStock ? 'ADD TO CART' : 'OUT OF STOCK'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className={`${viewMode === 'list' ? 'flex-1 p-4' : 'p-4'}`}>
        {/* Product Name */}
        <h3 className="font-medium text-primary mb-2 line-clamp-2 hover:text-accent transition-colors">
          {name}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={`${
                    i < Math.floor(rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {formatRating(rating)} ({reviewCount})
            </span>
          </div>
        )}

        {/* Key Specifications */}
        {specifications && Object.keys(specifications).length > 0 && (
          <div className="mb-2">
            {specifications.material && (
              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1">
                {specifications.material}
              </span>
            )}
            {specifications.length && (
              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1">
                {specifications.length}
              </span>
            )}
            {specifications.texture && (
              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1">
                {specifications.texture}
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                <Tag size={10} />
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-gray-500">+{tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          {isOnSale ? (
            <>
              <span className="text-lg font-bold text-primary">
                {formattedDiscountedPrice}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formattedPrice}
              </span>
              <span className="text-sm text-green-600 font-medium">
                {discountPercentage}% OFF
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-primary">
              {formattedPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 