import React from 'react';
import { useCartTotal, useOrderTotal } from '../../hooks/useCurrency';

const PriceTotal = ({ 
  items, 
  type = 'cart', // 'cart' or 'order'
  className = '', 
  showLabel = true,
  label = 'Total',
  size = 'normal' // 'small', 'normal', 'large'
}) => {
  const cartTotal = useCartTotal(type === 'cart' ? items : null);
  const orderTotal = useOrderTotal(type === 'order' ? items : null);
  
  const { total, isLoading } = type === 'cart' ? cartTotal : orderTotal;

  const sizeClasses = {
    small: 'text-sm',
    normal: 'text-base',
    large: 'text-lg font-semibold'
  };

  const renderTotal = () => {
    if (isLoading) {
      return (
        <div className={`${sizeClasses[size]} text-gray-400 animate-pulse`}>
          Calculating...
        </div>
      );
    }

    if (!items || items.length === 0) {
      return (
        <span className={`${sizeClasses[size]} text-gray-500`}>
          {label}: 0
        </span>
      );
    }

    return (
      <span className={`${sizeClasses[size]} font-semibold text-gray-900`}>
        {showLabel ? `${label}: ` : ''}{total}
      </span>
    );
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {renderTotal()}
    </div>
  );
};

export default PriceTotal; 