import React from 'react';
import { HeroSection } from '../components/ui';
import { SearchAndFilters, ProductGrid } from '../components/shop';
import { useShop, useCart, useProductDetails } from '../hooks';
import { ProductDetailsModal } from '../components/product-details';
import { toast } from 'react-toastify';
import shopHeroBg from '../assets/images/shop_bg.jpg';

const Shop = () => {
  const { addToCart, cartItems } = useCart();
  const { selectedProduct, isModalOpen, openProductDetails, closeProductDetails, handleProductClick } = useProductDetails();

  const {
    products,
    categories,
    loading,
    categoriesLoading,
    error,
    hasMore,
    viewMode,
    filterStats,
    handleSearch,
    handleFilterChange,
    handleSortChange,
    handleViewChange,
    handleLoadMore,
    resetFilters
  } = useShop();

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
    toast.info('Wishlist feature coming soon!', {
      position: "top-right",
      autoClose: 2000,
    });
  };
  
  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="Shop"
        subtitle="Discover our curated collection of premium products"
        breadcrumbs={['Home', 'Shop']}
        backgroundImage={shopHeroBg}
      >
        {/* Optional: Add hero content like featured categories or promotional text */}
        <div className="mt-8">
          <p className="text-white/80 text-sm">
            {filterStats.totalProducts} products available
          </p>
        </div>
      </HeroSection>

      {/* Search and Filters */}
      <SearchAndFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onViewChange={handleViewChange}
        categories={categories}
        viewMode={viewMode}
        loading={categoriesLoading}
      />

      {/* Filter Stats */}
      {filterStats.activeFilters > 0 && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>
                  Showing {filterStats.displayedProducts} of {filterStats.filteredProducts} products
                </span>
                {filterStats.activeFilters > 0 && (
                  <span className="bg-primary text-white px-2 py-1 rounded-full text-xs">
                    {filterStats.activeFilters} filter{filterStats.activeFilters > 1 ? 's' : ''} active
                  </span>
                )}
              </div>
              <button
                onClick={resetFilters}
                className="text-primary hover:text-primary/80 underline text-sm"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          viewMode={viewMode}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          onAddToCart={handleAddToCart}
          onViewDetails={handleViewDetails}
          onAddToWishlist={handleAddToWishlist}
          cartItems={cartItems}
        />
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

export default Shop;