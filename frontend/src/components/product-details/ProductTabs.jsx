import React, { useState } from 'react';
import { Star } from 'lucide-react';

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'features', label: 'Features' },
    { id: 'reviews', label: `Reviews (${product?.reviewCount || 0})` },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {product?.description || 'No description available.'}
            </p>
          </div>
        );

      case 'specifications':
        return (
          <div className="space-y-4">
            {product?.specifications && Object.keys(product.specifications).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No specifications available.</p>
            )}
          </div>
        );

      case 'features':
        return (
          <div className="space-y-4">
            {product?.features && product.features.length > 0 ? (
              <div className="space-y-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="border border-gray-200 rounded-sm p-4">
                    <h4 className="font-semibold text-primary mb-2">{feature.title}</h4>
                    {feature.description && (
                      <p className="text-gray-700 text-sm">{feature.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No features available.</p>
            )}
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            {/* Review Summary */}
            {product?.rating > 0 ? (
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{product.rating.toFixed(1)}</div>
                  <div className="flex justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{product.reviewCount} reviews</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet.</p>
                <p className="text-sm text-gray-400 mt-2">Be the first to review this product!</p>
              </div>
            )}

            {/* Individual Reviews - Placeholder for now */}
            {product?.reviewCount > 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">Reviews will be displayed here when available.</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-12">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProductTabs; 