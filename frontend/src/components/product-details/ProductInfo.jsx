import React, { useState, useEffect } from 'react';
import { Star, Minus, Plus, Heart, Share2, Tag, CheckCircle } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useCurrency } from '../../hooks/useCurrency';
import { toast } from 'react-toastify';

const ProductInfo = ({ product }) => {
  const { 
    name, 
    description, 
    price, 
    discount = 0,
    currency, 
    stock, 
    category, 
    rating = 0,
    reviewCount = 0,
    specifications = {},
    features = [],
    tags = []
  } = product;
  const { addToCart } = useCart();
  const { convertPrice, formatPrice, userCurrency } = useCurrency();
  const [quantity, setQuantity] = useState(1);
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

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1 || newQuantity > stock) return;
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleAddToWishlist = () => {
    // TODO: Implement wishlist functionality
    toast.info('Wishlist feature coming soon!', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: name,
        text: description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const isInStock = stock > 0;
  const isLowStock = stock > 0 && stock <= 5;
  const isOnSale = discount > 0;
  const discountPercentage = discount;

  // Format rating display
  const formatRating = (ratingValue) => {
    return ratingValue.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">{name}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isInStock ? 'In Stock' : 'Out of Stock'}
          </span>
          <span>SKU: {product._id.slice(-6).toUpperCase()}</span>
        </div>
      </div>

      {/* Rating */}
      {rating > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < Math.floor(rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {formatRating(rating)} ({reviewCount} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-3xl font-bold text-gray-400 animate-pulse">
            Loading...
          </div>
        ) : isOnSale ? (
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">
              {displayDiscountedPrice}
            </span>
            <span className="text-lg text-gray-500 line-through">
              {displayPrice}
            </span>
            <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
              {discountPercentage}% OFF
            </span>
          </div>
        ) : (
          <span className="text-3xl font-bold text-primary">
            {displayPrice}
          </span>
        )}
      </div>

      {/* Stock Status */}
      {isLowStock && isInStock && (
        <div className="flex items-center gap-2 text-orange-600">
          <CheckCircle size={16} />
          <span className="text-sm font-medium">Only {stock} left in stock</span>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={16} />
          </button>
          <span className="w-16 text-center text-lg font-medium">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= stock}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!isInStock}
          className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
            isInStock
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isInStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
        
        <div className="flex gap-3">
          <button
            onClick={handleAddToWishlist}
            className="flex-1 py-3 px-6 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Heart size={16} className="inline mr-2" />
            Add to Wishlist
          </button>
          <button
            onClick={handleShare}
            className="flex-1 py-3 px-6 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Share2 size={16} className="inline mr-2" />
            Share
          </button>
        </div>
      </div>

      {/* Features */}
      {features.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Features</h3>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Specifications */}
      {specifications && Object.keys(specifications).length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-sm text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo; 