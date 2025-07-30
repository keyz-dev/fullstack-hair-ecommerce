import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '../ui';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';

const RelatedProducts = ({ currentProduct, onProductClick }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { products, fetchProducts } = useProducts();
  const { addToCart } = useCart();

  useEffect(() => {
    loadRelatedProducts();
  }, [currentProduct, products]);

  const loadRelatedProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch products with category filter
      await fetchProducts({
        limit: 8,
        isActive: true,
        category: currentProduct.category?._id,
        sort: '-createdAt'
      });
      
      // Filter out the current product and get up to 4 related products
      const filtered = products
        .filter(product => product._id !== currentProduct._id)
        .slice(0, 4);
      
      setRelatedProducts(filtered);
    } catch (error) {
      console.error('Error loading related products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleViewDetails = (product) => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const handleAddToWishlist = () => {
    toast.info('Wishlist feature coming soon!', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  if (loading) {
    return (
      <div className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-100 animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
            onAddToWishlist={handleAddToWishlist}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts; 