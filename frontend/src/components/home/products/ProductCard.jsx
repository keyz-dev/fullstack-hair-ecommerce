import React from 'react';
import { Check } from 'lucide-react';
import { ProductBadge, ProductImage, ProductInfo, AddToCartOverlay } from './index';
import { useCart } from '../../../hooks';

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onViewDetails, 
  onQuickView,
  className = "",
}) => {
  const { isInCart } = useCart();
  const { 
    name, 
    price, 
    currency, 
    images, 
    stock, 
    originalPrice,
    isNew,
    isHot,
  } = product;

  // Calculations
  const isInStock = stock > 0;
  const isLowStock = stock > 0 && stock <= 5;
  const isOnSale = originalPrice && originalPrice > price;
  const discountPercentage = isOnSale ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  // Event Handlers
  const handleCardClick = (e) => {
    // Prevent navigation if clicking on interactive elements
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    onViewDetails?.(product);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onQuickView?.(product);
  };

  // Check if product is in cart
  const productInCart = isInCart(product._id);

  // Badge Configuration
  const badges = (
    <>
      {!isInStock && <ProductBadge type="outOfStock" />}
      {isOnSale && isInStock && <ProductBadge type="sale" value={discountPercentage} />}
      {isLowStock && isInStock && !isOnSale && <ProductBadge type="lowStock" />}
      {isHot && isInStock && !isOnSale && <ProductBadge type="hot" />}
      {isNew && isInStock && !isOnSale && !isHot && <ProductBadge type="new" />}
    </>
  );

  return (
    <article 
      className={`
        group
        bg-white rounded-sm
        hover:shadow-sm
        transition-all duration-300 ease-out
        overflow-hidden
        ${className}
      `}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e);
        }
      }}
      aria-label={`View details for ${name}`}
    >
      {/* Product Image Section */}
      <div className='relative overflow-hidden cursor-pointer'>
        <ProductImage
          images={images}
          name={name}
          badges={badges}
          onQuickView={handleQuickView}
          isInCart={productInCart}
        />
        {/* Add to Cart Overlay */}
        <AddToCartOverlay
          product={product}
          onAddToCart={onAddToCart}
          isInStock={isInStock}
          isInCart={productInCart}
        />
      </div>

      {/* Product Information */}
      <ProductInfo
        name={name}
        price={price}
        originalPrice={originalPrice}
        currency={currency}
        isOnSale={isOnSale}
        stock={stock}
      />
      
      {/* Focus ring for accessibility */}
      <div className="
        absolute inset-0 rounded-xl
        ring-2 ring-transparent group-focus:ring-blue-500
        pointer-events-none
      " />
    </article>
  );
};

// Higher-order component for different card variants
export const CompactProductCard = (props) => (
  <ProductCard {...props} variant="compact" className="max-w-xs" />
);

export const FeaturedProductCard = (props) => (
  <ProductCard {...props} variant="featured" className="max-w-sm" />
);

export default ProductCard;