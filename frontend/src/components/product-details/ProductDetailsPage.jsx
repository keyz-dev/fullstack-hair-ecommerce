import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductImageGallery, ProductInfo, ProductTabs, RelatedProducts } from './';

const ProductDetailsPage = ({ product, onProductClick }) => {
  const navigate = useNavigate();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-accent text-white px-6 py-3 rounded-sm hover:bg-accent/90 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <h1 className="text-lg font-semibold text-primary truncate">
              {product.name}
            </h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
  );
};

export default ProductDetailsPage; 