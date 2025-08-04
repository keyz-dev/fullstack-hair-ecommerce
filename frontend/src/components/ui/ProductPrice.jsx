import React from 'react';
import { useProductPrice } from '../../hooks/useCurrency';

const ProductPrice = ({ 
  product, 
  className = '', 
  showOriginal = false,
  showDiscount = true,
  size = 'normal' // 'small', 'normal', 'large'
}) => {
  const { displayPrice, isLoading } = useProductPrice(product);

  if (!product || (!product.price && product.price !== 0)) {
    return null;
  }

  const sizeClasses = {
    small: 'text-sm',
    normal: 'text-base',
    large: 'text-lg font-semibold'
  };

  const renderPrice = () => {
    if (isLoading) {
      return (
        <div className={`${sizeClasses[size]} text-gray-400 animate-pulse`}>
          Loading...
        </div>
      );
    }

    return (
      <span className={`${sizeClasses[size]} font-medium text-gray-900`}>
        {displayPrice}
      </span>
    );
  };

  const renderOriginalPrice = () => {
    if (!showOriginal || !product.originalPrice || product.originalPrice === product.price) {
      return null;
    }

    return (
      <span className={`${sizeClasses[size]} text-gray-500 line-through mr-2`}>
        {product.originalPrice} {product.currency}
      </span>
    );
  };

  const renderDiscount = () => {
    if (!showDiscount || !product.discount || product.discount <= 0) {
      return null;
    }

    return (
      <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
        -{product.discount}%
      </span>
    );
  };

  return (
    <div className={`flex items-center ${className}`}>
      {renderOriginalPrice()}
      {renderPrice()}
      {renderDiscount()}
    </div>
  );
};

export default ProductPrice; 