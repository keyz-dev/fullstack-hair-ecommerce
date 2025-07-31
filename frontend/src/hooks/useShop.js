import { useState, useEffect, useCallback, useMemo } from 'react';
import { useProducts } from './useProducts';
import { useCategory } from './useCategory';

export const useShop = () => {
  const { products, loading, error, fetchProducts } = useProducts();
  const { categories, loading: categoriesLoading } = useCategory();
  
  // State for filtering and search
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    priceRange: { min: '', max: '' }
  });
  
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts({
      isActive: true,
      sort: '-createdAt',
      limit: 50
    });
  }, [fetchProducts]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category?.name.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category?._id)
      );
    }

    // Price range filter
    if (filters.priceRange.min || filters.priceRange.max) {
      filtered = filtered.filter(product => {
        const price = product.price || 0;
        const min = filters.priceRange.min ? parseFloat(filters.priceRange.min) : 0;
        const max = filters.priceRange.max ? parseFloat(filters.priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Sort products
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-asc':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'popular':
        // Sort by popularity (you can implement this based on your data)
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, filters, sortBy]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const itemsPerPage = 12;
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const paginated = filteredAndSortedProducts.slice(startIndex, endIndex);
    
    // Check if there are more products
    setHasMore(endIndex < filteredAndSortedProducts.length);
    
    return paginated;
  }, [filteredAndSortedProducts, currentPage]);

  // Handle search
  const handleSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  // Handle sort changes
  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  }, []);

  // Handle view mode changes
  const handleViewChange = useCallback((newViewMode) => {
    setViewMode(newViewMode);
  }, []);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      categories: [],
      priceRange: { min: '', max: '' }
    });
    setSortBy('newest');
    setCurrentPage(1);
  }, []);

  // Get filter stats
  const filterStats = useMemo(() => {
    return {
      totalProducts: products.length,
      filteredProducts: filteredAndSortedProducts.length,
      displayedProducts: paginatedProducts.length,
      activeFilters: [
        filters.search && 'Search',
        filters.categories.length > 0 && 'Categories',
        (filters.priceRange.min || filters.priceRange.max) && 'Price Range'
      ].filter(Boolean).length
    };
  }, [products.length, filteredAndSortedProducts.length, paginatedProducts.length, filters]);

  return {
    // Data
    products: paginatedProducts,
    categories,
    loading,
    categoriesLoading,
    error,
    hasMore,
    
    // State
    filters,
    sortBy,
    viewMode,
    currentPage,
    
    // Actions
    handleSearch,
    handleFilterChange,
    handleSortChange,
    handleViewChange,
    handleLoadMore,
    resetFilters,
    
    // Stats
    filterStats,
    
    // Raw data for debugging
    allProducts: products,
    filteredProducts: filteredAndSortedProducts
  };
}; 