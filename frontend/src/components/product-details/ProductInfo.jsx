import React, { useState } from 'react';
import { Star, Minus, Plus, Heart, Share2, Tag, CheckCircle } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
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
  const [quantity, setQuantity] = useState(1);

  // Format price with currency
  const formatPrice = (priceValue) => {
    if (currency && currency.symbol) {
      return currency.position === 'after' 
        ? `${priceValue} ${currency.symbol}`
        : `${currency.symbol} ${priceValue}`;
    }
    return `${priceValue}`;
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1 || newQuantity > stock) return;
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart!`, {
      position: "top-right",
      autoClose: 2000,
    });
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
                className={`${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {formatRating(rating)} ({reviewCount} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="space-y-1">
        <div className="text-3xl font-bold text-accent">
          {formatPrice(price)}
        </div>
        {isOnSale && (
          <div className="flex items-center gap-2">
            <span className="bg-green-500 text-white text-sm px-2 py-1 rounded font-medium">
              {discountPercentage}% OFF
            </span>
          </div>
        )}
      </div>



      {/* Key Specifications */}
      {specifications && Object.keys(specifications).length > 0 && (
        <div className="border border-gray-200 rounded-sm p-4">
          <h3 className="font-medium text-primary mb-3">Key Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {specifications.material && (
              <div className="flex justify-between">
                <span className="text-gray-600">Material:</span>
                <span className="font-medium">{specifications.material}</span>
              </div>
            )}
            {specifications.length && (
              <div className="flex justify-between">
                <span className="text-gray-600">Length:</span>
                <span className="font-medium">{specifications.length}</span>
              </div>
            )}
            {specifications.texture && (
              <div className="flex justify-between">
                <span className="text-gray-600">Texture:</span>
                <span className="font-medium">{specifications.texture}</span>
              </div>
            )}
            {specifications.weight && (
              <div className="flex justify-between">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium">{specifications.weight}</span>
              </div>
            )}
            {specifications.density && (
              <div className="flex justify-between">
                <span className="text-gray-600">Density:</span>
                <span className="font-medium">{specifications.density}</span>
              </div>
            )}
            {specifications.hairType && (
              <div className="flex justify-between">
                <span className="text-gray-600">Hair Type:</span>
                <span className="font-medium">{specifications.hairType}</span>
              </div>
            )}
            {specifications.origin && (
              <div className="flex justify-between">
                <span className="text-gray-600">Origin:</span>
                <span className="font-medium">{specifications.origin}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Features */}
      {features && features.length > 0 && (
        <div className="border border-gray-200 rounded-sm p-4">
          <h3 className="font-medium text-primary mb-3">Key Features</h3>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-primary">{feature.title}</p>
                  {feature.description && (
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stock Status */}
      {isLowStock && isInStock && (
        <div className="bg-orange-50 border border-orange-200 rounded-sm p-3">
          <p className="text-orange-800 text-sm">
            ⚠️ Only {stock} {stock === 1 ? 'item' : 'items'} left in stock!
          </p>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            min="1"
            max={stock}
            className="w-16 text-center border border-gray-300 rounded-sm py-2"
          />
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= stock}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!isInStock}
          className={`flex-1 py-3 px-6 rounded-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isInStock
              ? 'bg-accent text-white hover:bg-accent/90 active:scale-95'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span className="text-lg">🛒</span>
          {isInStock ? 'ADD TO CART' : 'OUT OF STOCK'}
        </button>
        
        <button
          onClick={handleAddToWishlist}
          className="w-12 h-12 border border-gray-300 rounded-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Add to Wishlist"
        >
          <Heart size={20} className="text-gray-600" />
        </button>
        
        <button
          onClick={handleShare}
          className="w-12 h-12 border border-gray-300 rounded-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Share Product"
        >
          <Share2 size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Product Meta */}
      <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Category:</span>
          <span className="font-medium">{category?.name || 'Uncategorized'}</span>
        </div>
        <div className="flex justify-between">
          <span>Available:</span>
          <span className="font-medium">{stock} {stock === 1 ? 'item' : 'items'}</span>
        </div>
        {specifications.warranty && (
          <div className="flex justify-between">
            <span>Warranty:</span>
            <span className="font-medium">{specifications.warranty}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo; 