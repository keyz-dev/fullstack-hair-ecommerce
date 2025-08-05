import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import { ProductCard, Button } from '../ui';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { useProductDetails } from '../../hooks/useProductDetails';
import { ProductDetailsModal } from '../product-details';
import { toast } from 'react-toastify';
import { CurrencySelector } from '../header';

const Products = () => {
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
      limit: 8,
      isActive: true,
      sort: '-createdAt'
    });
  }, [fetchProducts]);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.', {
        position: "top-right",
        autoClose: 2000,
      });
    }
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

  const handleViewAll = () => {
    navigate('/shop');
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
      <h3 className="text-lg font-medium text-primary mb-2">No Products Available</h3>
      <p className="text-gray-500 mb-4">Check back soon for our latest products!</p>
    </div>
  );

  return (
    <>
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-secondary/70 max-w-2xl mx-auto mb-8">
            Discover our carefully curated collection of premium products, designed to enhance your lifestyle and meet your needs.
          </p>
        </div>

        <div className="flex justify-end gap-2 mb-4 items-center">
          <CurrencySelector />
          {/* View all products button */}
          <Button
            onClickHandler={handleViewAll}
            text="View All Products"
            additionalClasses="border border-line_clr text-secondary min-h-fit min-w-fit px-4 py-[5px]"
            trailingIcon={<ArrowRight size={16} />}
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : error ? (
            // Error state
            <div className="col-span-full text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => fetchProducts({
                  limit: 8,
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

        {/* View All Button (Mobile) */}
        {!loading && products.length > 0 && (
          <div className="text-center mt-8 lg:hidden">
            <button
              onClick={handleViewAll}
              className="inline-flex items-center gap-2 border border-accent text-accent px-6 py-3 rounded-xs font-medium hover:opacity-80 transition-colors"
            >
              View All Products
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>

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

export default Products; 