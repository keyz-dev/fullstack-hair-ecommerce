import React from 'react';
import { ModalWrapper } from '../../ui';
import { X, DollarSign, Package, Tag, Star, Calendar, Image as ImageIcon } from 'lucide-react';

const ViewProductModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price, currency = 'XAF') => {
    return `${price} ${currency}`;
  };

  return (
    <ModalWrapper>
      <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
            <p className="text-sm text-gray-600 mt-1">View product information</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="p-6">
            {/* Product Images */}
            {product.images && product.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ImageIcon size={20} />
                  Product Images
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Product Name</label>
                    <p className="text-gray-900 font-medium">{product.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900">{product.description}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-gray-900">{product.category?.name || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="flex gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.isActive ? 'active' : 'inactive')}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {product.isFeatured && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                      {product.isOnSale && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          On Sale
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-green-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Price</label>
                      <p className="text-gray-900 font-medium">
                        {formatPrice(product.price, product.currency?.code || 'XAF')}
                      </p>
                    </div>
                  </div>
                  
                  {product.discount > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Discount</label>
                      <p className="text-gray-900">{product.discount}%</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-blue-600" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Stock</label>
                      <p className="text-gray-900">{product.stock} units</p>
                    </div>
                  </div>
                  
                  {product.rating && (
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-500" />
                      <div>
                        <label className="text-sm font-medium text-gray-500">Rating</label>
                        <p className="text-gray-900">{product.rating}/5</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).some(key => product.specifications[key]) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <div key={key}>
                        <label className="text-sm font-medium text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <p className="text-gray-900">{value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">{feature.title}</h4>
                      {feature.description && (
                        <p className="text-gray-700 text-sm">{feature.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Variants</h3>
                <div className="space-y-3">
                  {product.variants.map((variant, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">{variant.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((option, optIndex) => (
                          <span key={optIndex} className="bg-white text-gray-800 text-xs px-2 py-1 rounded border">
                            {option}
                          </span>
                        ))}
                      </div>
                      {variant.required && (
                        <span className="inline-block mt-2 text-xs text-red-600 font-medium">
                          Required
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag size={20} />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* SEO Information */}
            {(product.metaTitle || product.metaDescription) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Information</h3>
                <div className="space-y-3">
                  {product.metaTitle && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Meta Title</label>
                      <p className="text-gray-900">{product.metaTitle}</p>
                    </div>
                  )}
                  {product.metaDescription && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Meta Description</label>
                      <p className="text-gray-900">{product.metaDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar size={20} />
                Timestamps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900">{formatDate(product.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900">{formatDate(product.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ViewProductModal; 