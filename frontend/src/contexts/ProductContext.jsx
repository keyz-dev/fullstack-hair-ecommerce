import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { productApi } from "../api/product";

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
    status: "all",
    category: "all",
    priceRange: "all",
    search: "",
    sortBy: "-createdAt",
  },
  pagination: {
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  },
  stats: {
    total: 0,
    active: 0,
    inactive: 0,
    outOfStock: 0,
    totalRevenue: 0,
  },
};

// Action types
const PRODUCT_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_PRODUCTS: "SET_PRODUCTS",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  SET_STATS: "SET_STATS",
  ADD_PRODUCT: "ADD_PRODUCT",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  DELETE_PRODUCT: "DELETE_PRODUCT",
  REFRESH_PRODUCTS: "REFRESH_PRODUCTS",
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
          totalPages: action.payload.totalPages || 1,
        },
        loading: false,
        error: null,
      };

    case PRODUCT_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 },
      };

    case PRODUCT_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case PRODUCT_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };

    case PRODUCT_ACTIONS.ADD_PRODUCT:
      return {
        ...state,
        products: [action.payload, ...state.products],
      };

    case PRODUCT_ACTIONS.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        ),
      };

    case PRODUCT_ACTIONS.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(
          (product) => product._id !== action.payload
        ),
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
    const stats = {
      total: products.length,
      active: products.filter((p) => p.isActive === true).length,
      inactive: products.filter((p) => p.isActive === false).length,
      inStock: products.filter((p) => p.stock > 10).length,
      limitedStock: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
      outOfStock: products.filter((p) => p.stock <= 0).length,
      totalRevenue: products
        .filter((p) => p.isActive === true)
        .reduce((sum, p) => sum + p.price * (p.soldQuantity || 0), 0),
    };

    return stats;
  }, []);

  // Fetch all products
  const fetchProducts = useCallback(async (page = 1) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });

      // Always fetch all products for client-side filtering
      const response = await productApi.getAllProducts({
        page: 1, // Always fetch page 1
        limit: 1000, // Get a large number to have all products for client-side filtering
        sort: "-createdAt", // Default sort
        search: undefined, // Don't filter on server - we'll filter client-side
        category: undefined,
        stock_status: undefined,
        price_range: undefined,
      });

      const fetchedProducts = response.data?.products || [];

      dispatch({
        type: PRODUCT_ACTIONS.SET_PRODUCTS,
        payload: {
          products: fetchedProducts,
          total: fetchedProducts.length,
          totalPages: 1, // We'll calculate this client-side
        },
      });
    } catch (err) {
      console.error("Error fetching products:", err);
      const errorMessage =
        extractErrorMessage(err) ||
        "Failed to load products. Please try again.";
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: errorMessage });
    }
  }, []); // Removed filters dependency

  // Fetch product stats
  const fetchStats = useCallback(async () => {
    try {
      // Always use calculated stats from current products for consistency
      const calculatedStats = calculateStats(state.products);
      dispatch({ type: PRODUCT_ACTIONS.SET_STATS, payload: calculatedStats });
    } catch (err) {
      console.error("Error calculating product stats:", err);
      // Fallback to calculated stats
      const calculatedStats = calculateStats(state.products);
      dispatch({ type: PRODUCT_ACTIONS.SET_STATS, payload: calculatedStats });
    }
  }, [calculateStats, state.products]);

  // Filter and sort products based on current filters (client-side)
  const getFilteredProducts = useCallback(() => {
    let filtered = state.products.filter((product) => {
      // Status filter
      if (state.filters.status !== "all") {
        if (state.filters.status === "active" && !product.isActive)
          return false;
        if (state.filters.status === "inactive" && product.isActive)
          return false;
      }

      // Category filter
      if (
        state.filters.category !== "all" &&
        product.category?._id !== state.filters.category
      ) {
        return false;
      }

      // Price range filter
      if (state.filters.priceRange !== "all") {
        const price = product.price || 0;
        switch (state.filters.priceRange) {
          case "0-1000":
            if (price > 1000) return false;
            break;
          case "1000-5000":
            if (price < 1000 || price > 5000) return false;
            break;
          case "5000-10000":
            if (price < 5000 || price > 10000) return false;
            break;
          case "10000+":
            if (price < 10000) return false;
            break;
          default:
            break;
        }
      }

      // Search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        const productName = product.name?.toLowerCase() || "";
        const productDescription = product.description?.toLowerCase() || "";
        const productCategory = product.category?.name?.toLowerCase() || "";

        if (
          !productName.includes(searchTerm) &&
          !productDescription.includes(searchTerm) &&
          !productCategory.includes(searchTerm)
        ) {
          return false;
        }
      }

      return true;
    });

    // Sort products
    if (state.filters.sortBy) {
      filtered.sort((a, b) => {
        switch (state.filters.sortBy) {
          case "name":
            return (a.name || "").localeCompare(b.name || "");
          case "-name":
            return (b.name || "").localeCompare(a.name || "");
          case "price":
            return (a.price || 0) - (b.price || 0);
          case "-price":
            return (b.price || 0) - (a.price || 0);
          case "stock":
            return (a.stock || 0) - (b.stock || 0);
          case "-stock":
            return (b.stock || 0) - (a.stock || 0);
          case "createdAt":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "-createdAt":
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
    }

    return filtered;
  }, [state.products, state.filters]);

  // Get paginated products from filtered results
  const getPaginatedProducts = useCallback(() => {
    const filteredProducts = getFilteredProducts();
    const startIndex = (state.pagination.page - 1) * state.pagination.limit;
    const endIndex = startIndex + state.pagination.limit;
    return filteredProducts.slice(startIndex, endIndex);
  }, [getFilteredProducts, state.pagination.page, state.pagination.limit]);

  // Calculate pagination info from filtered results
  const getPaginationInfo = useCallback(() => {
    const filteredProducts = getFilteredProducts();
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / state.pagination.limit);

    return {
      total,
      totalPages,
      currentPage: state.pagination.page,
    };
  }, [getFilteredProducts, state.pagination.limit, state.pagination.page]);

  // Actions
  const actions = {
    // Product management
    addProduct: (product) => {
      dispatch({ type: PRODUCT_ACTIONS.ADD_PRODUCT, payload: product });
    },

    updateProduct: (product) => {
      dispatch({ type: PRODUCT_ACTIONS.UPDATE_PRODUCT, payload: product });
    },

    deleteProduct: (productId) => {
      dispatch({ type: PRODUCT_ACTIONS.DELETE_PRODUCT, payload: productId });
    },

    // Filter management
    setFilter: (filterType, value) => {
      dispatch({
        type: PRODUCT_ACTIONS.SET_FILTERS,
        payload: { [filterType]: value },
      });
      // Reset to page 1 when filters change
      dispatch({ type: PRODUCT_ACTIONS.SET_PAGINATION, payload: { page: 1 } });
    },

    setSearch: (searchTerm) => {
      dispatch({
        type: PRODUCT_ACTIONS.SET_FILTERS,
        payload: { search: searchTerm },
      });
      // Reset to page 1 when search changes
      dispatch({ type: PRODUCT_ACTIONS.SET_PAGINATION, payload: { page: 1 } });
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
      dispatch({
        type: PRODUCT_ACTIONS.SET_FILTERS,
        payload: initialState.filters,
      });
      dispatch({ type: PRODUCT_ACTIONS.SET_PAGINATION, payload: { page: 1 } });
    },
  };

  // Create product function
  const createProduct = useCallback(async (productData) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });

      const response = await productApi.addProduct(productData);

      if (response.success) {
        // Add the new product to local state
        dispatch({
          type: PRODUCT_ACTIONS.ADD_PRODUCT,
          payload: response.product,
        });
        return response;
      } else {
        throw new Error(response.message || "Failed to create product");
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Update product function
  const updateProduct = useCallback(async (productId, productData) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });

      const response = await productApi.updateProduct(productId, productData);

      if (response.success) {
        // Update the product in local state
        dispatch({
          type: PRODUCT_ACTIONS.UPDATE_PRODUCT,
          payload: response.product,
        });
        return response;
      } else {
        throw new Error(response.message || "Failed to update product");
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Delete product function
  const deleteProduct = useCallback(async (productId) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });

      const response = await productApi.deleteProduct(productId);

      if (response.success) {
        // Remove the product from local state
        dispatch({ type: PRODUCT_ACTIONS.DELETE_PRODUCT, payload: productId });
        return response;
      } else {
        throw new Error(response.message || "Failed to delete product");
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Context value
  const value = {
    ...state,
    filteredProducts: getPaginatedProducts(), // Return paginated filtered products
    stats: calculateStats(getFilteredProducts()), // Calculate stats from filtered products
    pagination: {
      ...state.pagination,
      ...getPaginationInfo(), // Include calculated pagination info
    },
    actions,
    fetchProducts,
    fetchStats,
    createProduct,
    updateProduct,
    deleteProduct,
  };

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

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export { ProductContext, ProductProvider };
