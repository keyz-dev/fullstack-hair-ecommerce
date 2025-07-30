import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import { ProductCard } from '../components/ui';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useProductDetails } from '../hooks/useProductDetails';
import { ProductDetailsModal } from '../components/product-details';
import { toast } from 'react-toastify';

const Shop = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { 
    products, 
    loading, 
    error, 
    fetchProducts 
  } = useProducts();
  
  const {
    selectedProduct,
    isModalOpen,
    openProductDetails,
    closeProductDetails,
    handleProductClick,
  } = useProductDetails();

  useEffect(() => {
    fetchProducts({
      isActive: true,
      sort: '-createdAt'
    });
  }, [fetchProducts]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleViewDetails = (product) => {
    openProductDetails(product);
  };

  const handleAddToWishlist = () => {
    // TODO: Implement wishlist functionality
    toast.info('Wishlist feature coming soon!', {
      position: "top-right",
      autoClose: 2000,
    });
  };

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
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Available</h3>
      <p className="text-gray-500 mb-4">Check back soon for our latest products!</p>
    </div>
  );

  return (
    <>
      <div className='w-full h-auto flex flex-col items-center gap-20 p-2 pt-0 lg:p-0 mb-3'>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Our Shop
            </h1>
            <p className="text-lg text-secondary/70 max-w-2xl mx-auto">
              Browse our complete collection of premium products
            </p>
          </div>
        </div>
        
        {/* TODO: Add filtering, search, and pagination here */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 12 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : error ? (
              // Error state
              <div className="col-span-full text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => fetchProducts({
                    isActive: true,
                    sort: '-createdAt'
                  })}
                  className="bg-accent text-white px-4 py-2 rounded-sm hover:bg-accent/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              // Empty state
              <EmptyState />
            ) : (
              // Products
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewDetails}
                  onAddToWishlist={handleAddToWishlist}
                />
              ))
            )}
          </div>
        </section>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={closeProductDetails}
        product={selectedProduct}
        onProductClick={handleProductClick}
      />
    </>
  );
};

export default Shop;