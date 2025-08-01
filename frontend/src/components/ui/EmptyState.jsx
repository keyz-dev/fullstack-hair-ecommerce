import React from 'react';
import { ShoppingBag, Package, Search, AlertCircle } from 'lucide-react';

const EmptyState = ({ 
  title = "No Data Found", 
  description = "There's nothing to display here.", 
  icon = "package",
  action = null 
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'shopping-bag':
        return <ShoppingBag className="w-12 h-12 text-gray-400" />;
      case 'package':
        return <Package className="w-12 h-12 text-gray-400" />;
      case 'search':
        return <Search className="w-12 h-12 text-gray-400" />;
      case 'alert':
        return <AlertCircle className="w-12 h-12 text-gray-400" />;
      default:
        return <Package className="w-12 h-12 text-gray-400" />;
    }
  };

  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState; 