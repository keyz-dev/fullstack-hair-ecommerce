import React, { useState } from 'react';
import { Star } from 'lucide-react';

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Additional Information' },
    { id: 'reviews', label: 'Reviews (2)' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Premium quality materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Durable and long-lasting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Easy to maintain and clean</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span>Versatile design for multiple uses</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 'specifications':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">1.6 Kg</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-medium">Premium Fabric</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="font-medium">45 x 35 x 25 cm</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Color:</span>
                  <span className="font-medium">{product.category?.name || 'Standard'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Warranty:</span>
                  <span className="font-medium">1 Year</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Care Instructions:</span>
                  <span className="font-medium">Hand wash only</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            {/* Review Summary */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">4.0</div>
                <div className="flex justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600 mt-1">2 reviews</div>
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-8">{stars}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${stars === 5 ? 50 : stars === 4 ? 50 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {stars === 5 ? 1 : stars === 4 ? 1 : 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span className="font-medium">John D.</span>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  Great product! Exactly what I was looking for. The quality is excellent and it arrived on time.
                </p>
                <div className="text-xs text-gray-500 mt-2">2 days ago</div>
              </div>

              <div className="border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <span className="font-medium">Sarah M.</span>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  Very satisfied with this purchase. The product meets all my expectations and the customer service was helpful.
                </p>
                <div className="text-xs text-gray-500 mt-2">1 week ago</div>
              </div>
            </div>
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