import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Eye, Star, Check } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';

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
    category,
    description,
    specifications = {}
  } = product;
  
  const { convertPrice, formatPrice, userCurrency } = useCurrency();
  const [displayPrice, setDisplayPrice] = useState('');
  const [displayDiscountedPrice, setDisplayDiscountedPrice] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Convert and format prices
  useEffect(() => {
    const loadPrices = async () => {
      if (!price) {
        setDisplayPrice('');
        setDisplayDiscountedPrice('');
        setIsLoading(false);
        return;
      }
      
      // Ensure currency is valid, default to XAF if not
      const validCurrency = currency || 'XAF';

      try {
        setIsLoading(true);
        
        // Convert price to user's currency
        const convertedPrice = await convertPrice(price, validCurrency, userCurrency);
        const formattedPrice = formatPrice(convertedPrice, userCurrency);
        setDisplayPrice(formattedPrice);
        
        // Calculate and format discounted price
        if (discount > 0) {
          const discountedPrice = convertedPrice * (1 - discount / 100);
          const formattedDiscountedPrice = formatPrice(discountedPrice, userCurrency);
          setDisplayDiscountedPrice(formattedDiscountedPrice);
        } else {
          setDisplayDiscountedPrice('');
        }
      } catch (error) {
        console.error('Error converting price:', error);
        // Fallback to original price with proper currency handling
        const fallbackCurrency = currency || 'XAF';
        setDisplayPrice(`${price} ${fallbackCurrency}`);
        setDisplayDiscountedPrice('');
      } finally {
        setIsLoading(false);
      }
    };

    loadPrices();
  }, [price, currency, discount, userCurrency, convertPrice, formatPrice]);

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
        {isOnSale && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded font-medium z-10">
            {discount}% OFF
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
            onClick={handleViewDetails}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
            title="View Details"
          >
            <Eye size={14} className="text-gray-700" />
          </button>
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
      </div>

      {/* Product Info */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Product Name */}
          <h3 className="font-semibold text-lg text-primary mb-2 hover:text-accent transition-colors line-clamp-2">
            {name}
          </h3>

          {/* Category */}
          {category && (
            <p className="text-sm text-gray-600 mb-2">
              {category.name}
            </p>
          )}

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {description}
            </p>
          )}

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1 mb-3">
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

          {/* Key Specifications */}
          {keySpecs.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {keySpecs.map((spec, index) => (
                  <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {spec.label}: {spec.value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          {isLowStock && isInStock && (
            <p className="text-sm text-orange-600 mb-2">
              Only {stock} left in stock
            </p>
          )}
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          {/* Price */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="text-lg font-bold text-gray-400 animate-pulse">
                Loading...
              </div>
            ) : isOnSale ? (
              <>
                <span className="text-xl font-bold text-primary">
                  {displayDiscountedPrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {displayPrice}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  {discount}% OFF
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-primary">
                {displayPrice}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleViewDetails}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              View Details
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                isInCart
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : isInStock
                  ? 'bg-accent text-white hover:bg-accent/90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isInCart ? 'Added' : isInStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem; 