import React, { useState, useEffect, useCallback } from 'react';
import { Package, Loader } from 'lucide-react';
import { ProductCard } from '../ui';
import ProductListItem from './ProductListItem';
import { useInView } from 'react-intersection-observer';

const ProductGrid = ({ 
  products = [], 
  loading = false, 
  error = null, 
  viewMode = 'grid',
  onLoadMore,
  hasMore = false,
  onAddToCart,
  onViewDetails,
  onAddToWishlist,
  cartItems = [],
  className = "" 
}) => {
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const productsPerPage = 12;
  
  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Load more products when scroll reaches bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      handleLoadMore();
    }
  }, [inView, hasMore, loading]);

  // Update displayed products when products array changes
  useEffect(() => {
    const startIndex = 0;
    const endIndex = page * productsPerPage;
    setDisplayedProducts(products.slice(startIndex, endIndex));
  }, [products, page]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
      onLoadMore && onLoadMore();
    }
  }, [hasMore, loading, onLoadMore]);

  // Loading skeleton
  const ProductSkeleton = () => (
    <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
      <Package className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-primary mb-2">No Products Found</h3>
      <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
    </div>
  );

  // Error state
  const ErrorState = () => (
    <div className="col-span-full text-center py-12">
      <p className="text-red-500 mb-4">{error}</p>
      <button
        onClick={handleLoadMore}
        className="bg-accent text-white px-4 py-2 rounded-sm hover:bg-accent/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  // Grid view classes
  const getGridClasses = () => {
    if (viewMode === 'list') {
      return 'grid-cols-1';
    }
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  // Check if product is in cart
  const isProductInCart = (productId) => {
    return cartItems.some(item => {
      return item._id === productId;
    });
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Products Grid */}
      <div className={`grid ${getGridClasses()} gap-6`}>
        {loading && page === 1 ? (
          // Initial loading skeletons
          Array.from({ length: productsPerPage }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))
        ) : error ? (
          // Error state
          <ErrorState />
        ) : displayedProducts.length === 0 ? (
          // Empty state
          <EmptyState />
        ) : (
          // Products
          <>
            {displayedProducts.map((product) => (
              viewMode === 'list' ? (
                <ProductListItem
                  key={product._id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                  onAddToWishlist={onAddToWishlist}
                  isInCart={isProductInCart(product._id)}
                />
              ) : (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                  onAddToWishlist={onAddToWishlist}
                  viewMode={viewMode}
                  isInCart={isProductInCart(product._id)}
                />
              )
            ))}
            
            {/* Load more skeletons */}
            {loading && page > 1 && (
              Array.from({ length: 4 }).map((_, index) => (
                <ProductSkeleton key={`skeleton-${index}`} />
              ))
            )}
          </>
        )}
      </div>

      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center mt-8">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Loading more products...</span>
            </div>
          ) : (
            <button
              onClick={handleLoadMore}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Load More Products
            </button>
          )}
        </div>
      )}

      {/* End of results */}
      {!hasMore && displayedProducts.length > 0 && (
        <div className="text-center mt-8 py-4 text-gray-500">
          <p>You've reached the end of our products</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid; 