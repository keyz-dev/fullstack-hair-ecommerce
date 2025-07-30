import React from 'react';
import { ProductBadge, ProductImage, ProductInfo, AddToCartOverlay } from './index';

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onViewDetails, 
  onAddToWishlist,
  onQuickView,
  className = "",
  variant = "default" // default, compact, featured
}) => {
  const { 
    name, 
    price, 
    currency, 
    images, 
    stock, 
    originalPrice,
    isNew,
    isHot,
    _id 
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
        group relative
        bg-white rounded-md
        border border-gray-100 hover:border-gray-200
        shadow-sm hover:shadow-xl
        transition-all duration-300 ease-out
        cursor-pointer overflow-hidden
        transform hover:-translate-y-1
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
      <ProductImage
        images={images}
        name={name}
        badges={badges}
        onQuickView={handleQuickView}
      />
      {/* Add to Cart Overlay */}
      <AddToCartOverlay
        product={product}
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        isInStock={isInStock}
      />

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