import React from 'react';
import { useParams } from 'react-router-dom';
import { ProductDetailsPage } from '../components/product-details';
import { useProductDetails } from '../hooks/useProductDetails';

const ProductDetails = () => {
  const { id } = useParams();
  const { 
    selectedProduct, 
    loading, 
    error, 
    handleProductClick 
  } = useProductDetails();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-accent text-white px-6 py-3 rounded-sm hover:bg-accent/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailsPage 
      product={selectedProduct} 
      onProductClick={handleProductClick} 
    />
  );
};

export default ProductDetails;