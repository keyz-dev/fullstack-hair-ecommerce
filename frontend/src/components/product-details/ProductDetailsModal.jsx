import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ProductImageGallery, ProductInfo, ProductTabs, RelatedProducts } from './';

const ProductDetailsModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onProductClick 
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-sm shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-primary">Product Details</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="p-6">
              {/* Main Product Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Image Gallery */}
                <div>
                  <ProductImageGallery 
                    images={product.images || []} 
                    productName={product.name} 
                  />
                </div>

                {/* Product Info */}
                <div>
                  <ProductInfo product={product} />
                </div>
              </div>

              {/* Tabs Section */}
              <ProductTabs product={product} />

              {/* Related Products */}
              <RelatedProducts 
                currentProduct={product} 
                onProductClick={onProductClick} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal; 