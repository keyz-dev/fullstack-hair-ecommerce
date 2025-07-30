import React, { useState } from 'react';
import { Star, Minus, Plus, Heart, Share2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';

const ProductInfo = ({ product }) => {
  const { name, description, price, currency, stock, category, images } = product;
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

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isInStock ? 'In Stock' : 'Out of Stock'}
          </span>
          <span>SKU: {product._id.slice(-6).toUpperCase()}</span>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={`${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">(4.0)</span>
      </div>

      {/* Price */}
      <div className="text-3xl font-bold text-accent">
        {formatPrice(price)}
      </div>

      {/* Description */}
      <div>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>

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
      </div>
    </div>
  );
};

export default ProductInfo; 