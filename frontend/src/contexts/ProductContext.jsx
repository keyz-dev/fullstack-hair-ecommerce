import React, { createContext, useReducer, useCallback, useEffect, useMemo } from "react";
import { productApi } from "../api/product";
import { toast } from "react-toastify";

// Utility function to extract error message from API errors
const extractErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  if (error?.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

// Initial state
const initialState = {
  products: [],
  loading: true,
  error: null,
  filters: {
    status: 'all',
    category: 'all',
    priceRange: 'all',
    search: '',
    sortBy: '-createdAt'
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  },
  stats: {
    total: 0,
    active: 0,
    inactive: 0,
    outOfStock: 0,
    totalRevenue: 0
  }
};

// Action types
const PRODUCT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_STATS: 'SET_STATS',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  REFRESH_PRODUCTS: 'REFRESH_PRODUCTS'
};

// Reducer
const productReducer = (state, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case PRODUCT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case PRODUCT_ACTIONS.SET_PRODUCTS:
      return { 
        ...state, 
        products: action.payload.products || [],
        pagination: {
          ...state.pagination,
          total: action.payload.total || action.payload.products?.length || 0,
          totalPages: action.payload.totalPages || 1
        },
        loading: false,
        error: null
      };
    
    case PRODUCT_ACTIONS.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 }
      };
    
    case PRODUCT_ACTIONS.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    
    case PRODUCT_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };
    
    case PRODUCT_ACTIONS.ADD_PRODUCT:
      return {
        ...state,
        products: [action.payload, ...state.products]
      };
    
    case PRODUCT_ACTIONS.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product => 
          product._id === action.payload._id ? action.payload : product
        )
      };
    
    case PRODUCT_ACTIONS.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload)
      };
    
    case PRODUCT_ACTIONS.REFRESH_PRODUCTS:
      return { ...state, loading: true, error: null };
    
    default:
      return state;
  }
};

// Create context
const ProductContext = createContext();

// Provider component
const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Calculate product statistics
  const calculateStats = useCallback((products) => {
    return {
      total: products.length,
      active: products.filter(p => p.status === 'active').length,
      inactive: products.filter(p => p.status === 'inactive').length,
      inStock: products.filter(p => p.stockQuantity > 10).length,
      limitedStock: products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 10).length,
      outOfStock: products.filter(p => p.stockQuantity <= 0).length,
      totalRevenue: products
        .filter(p => p.status === 'active')
        .reduce((sum, p) => sum + (p.price * p.soldQuantity || 0), 0)
    };
  }, []);

  // Fetch all products
  const fetchProducts = useCallback(async (page = 1, filters = null) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      
      const currentFilters = filters || state.filters;
      const currentLimit = state.pagination.limit;
      
      const response = await productApi.getAllProducts({
        page,
        limit: currentLimit,
        status: currentFilters.status !== 'all' ? currentFilters.status : undefined,
        category: currentFilters.category !== 'all' ? currentFilters.category : undefined,
        search: currentFilters.search || undefined,
        sort: currentFilters.sortBy
      });
      
      const fetchedProducts = response.data?.products || [];
      const totalProducts = response.data?.pagination?.total || fetchedProducts.length;
      const totalPages = response.data?.pagination?.totalPages || 1;
      
      dispatch({
        type: PRODUCT_ACTIONS.SET_PRODUCTS,
        payload: { 
          products: fetchedProducts, 
          total: totalProducts,
          totalPages
        }
      });
      
    } catch (err) {
      console.error('Error fetching products:', err);
      const errorMessage = extractErrorMessage(err) || 'Failed to load products. Please try again.';
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error('Failed to load products');
    }
  }, [state.pagination.limit]);

  // Fetch product stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await productApi.getProductStats();
      const stats = response.stats || calculateStats(state.products);
      
      dispatch({ type: PRODUCT_ACTIONS.SET_STATS, payload: stats });
      
    } catch (err) {
      console.error('Error fetching product stats:', err);
      // Fallback to calculated stats
      const calculatedStats = calculateStats(state.products);
      dispatch({ type: PRODUCT_ACTIONS.SET_STATS, payload: calculatedStats });
    }
  }, [calculateStats]);

  // Filter products based on current filters (client-side)
  const getFilteredProducts = useCallback(() => {
    return state.products.filter(product => {
      // Status filter
      if (state.filters.status !== 'all' && product.status !== state.filters.status) {
        return false;
      }
      
      // Category filter
      if (state.filters.category !== 'all' && product.category !== state.filters.category) {
        return false;
      }
      
      // Price range filter
      if (state.filters.priceRange !== 'all') {
        const price = product.price || 0;
        switch (state.filters.priceRange) {
          case 'low':
            if (price > 10000) return false;
            break;
          case 'medium':
            if (price < 10000 || price > 50000) return false;
            break;
          case 'high':
            if (price < 50000) return false;
            break;
          default:
            break;
        }
      }
      
      // Search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        const productName = product.name?.toLowerCase() || '';
        const productDescription = product.description?.toLowerCase() || '';
        const productSku = product.sku?.toLowerCase() || '';
        
        if (!productName.includes(searchTerm) && 
            !productDescription.includes(searchTerm) && 
            !productSku.includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
  }, [state.products, state.filters]);

  // Create product
  const createProduct = useCallback(async (data) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "productImages" && data[key].length > 0) {
          data[key].forEach(img => {
            formData.append("productImages", img);
          })
        } else if (key === "variants" || key === "features" || key === "specifications") {
          // Convert complex objects to JSON strings for FormData
          if (data[key] && (Array.isArray(data[key]) || typeof data[key] === 'object')) {
            // Handle empty arrays/objects
            if (Array.isArray(data[key]) && data[key].length === 0) {
              formData.append(key, JSON.stringify([]));
            } else if (typeof data[key] === 'object' && Object.keys(data[key]).length === 0) {
              formData.append(key, JSON.stringify({}));
            } else {
              formData.append(key, JSON.stringify(data[key]));
            }
          } else if (data[key] === null || data[key] === undefined) {
            // Handle null/undefined values
            formData.append(key, '');
          } else {
            formData.append(key, data[key]);
          }
        } else if (key === "tags") {
          // Handle tags - convert array to comma-separated string
          if (Array.isArray(data[key])) {
            formData.append(key, data[key].join(','));
          } else if (data[key] === null || data[key] === undefined) {
            formData.append(key, '');
          } else {
            formData.append(key, data[key]);
          }
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await productApi.addProduct(formData);
      const newProduct = response.data || response;
      
      // Add the new product to the state
      dispatch({ type: PRODUCT_ACTIONS.ADD_PRODUCT, payload: newProduct });
      
      toast.success('Product created successfully');
      return newProduct;
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || 'Failed to create product';
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error('Failed to create product');
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Update product
  const updateProduct = useCallback(async (id, data) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      
      const response = await productApi.updateProduct(id, data);
      const updatedProduct = response.data || response;
      
      dispatch({ type: PRODUCT_ACTIONS.UPDATE_PRODUCT, payload: updatedProduct });
      
      toast.success('Product updated successfully');
      return updatedProduct;
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || 'Failed to update product';
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error('Failed to update product');
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Delete product
  const deleteProduct = useCallback(async (id) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      
      await productApi.deleteProduct(id);
      dispatch({ type: PRODUCT_ACTIONS.DELETE_PRODUCT, payload: id });
      
      toast.success('Product deleted successfully');
      return true;
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || 'Failed to delete product';
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error('Failed to delete product');
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Actions - memoized to prevent unnecessary re-renders
  const actions = useMemo(() => ({
    // Filter management
    setFilter: (filterType, value) => {
      dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload: { [filterType]: value } });
    },
    
    setSearch: (searchTerm) => {
      dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload: { search: searchTerm } });
    },
    
    // Pagination
    setPage: (page) => {
      dispatch({ type: PRODUCT_ACTIONS.SET_PAGINATION, payload: { page } });
    },
    
    // Refresh products
    refreshProducts: () => {
      dispatch({ type: PRODUCT_ACTIONS.REFRESH_PRODUCTS });
    },
    
    // Clear all filters
    clearAllFilters: () => {
      dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload: initialState.filters });
    }
  }), []);

  // Fetch products on mount only
  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array - only run on mount

  // Fetch stats when products change
  useEffect(() => {
    if (state.products.length > 0) {
      fetchStats();
    }
  }, [state.products.length]); // Only depend on products length, not fetchStats

  // Context value - memoized to prevent unnecessary re-renders
  const value = useMemo(() => ({
    ...state,
    filteredProducts: getFilteredProducts(),
    actions,
    fetchProducts,
    fetchStats,
    createProduct,
    updateProduct,
    deleteProduct
  }), [state, getFilteredProducts, actions, fetchProducts, fetchStats, createProduct, updateProduct, deleteProduct]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export { ProductContext, ProductProvider };