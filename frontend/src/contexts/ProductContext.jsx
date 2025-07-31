import React, { createContext, useState, useCallback } from "react";
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

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  // State
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("-createdAt");
  const [search, setSearch] = useState("");

  // Fetch Products (with pagination, filters, search, sort)
  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productApi.getAllProducts({
        page,
        limit,
        sort,
        search,
        ...filters,
        ...params,
      });
      setProducts(res.data.products);
      setTotal(res.data.pagination.total);
      setTotalPages(res.data.pagination.totalPages);
      setPage(res.data.pagination.page);
      setLimit(res.data.pagination.limit);
    } catch (err) {
      setError(extractErrorMessage(err) || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [page, limit, sort, search, filters]);

  // Fetch Product Stats
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productApi.getProductStats();
      setStats(res.stats);
    } catch (err) {
      setError(extractErrorMessage(err) || "Failed to fetch product stats");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create Product
  const createProduct = async (data) => {
    setLoading(true);
    setError(null);
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

    try {
      const res = await productApi.addProduct(formData);
      await fetchProducts();
      await fetchStats();
      return res;
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to create product";
      setError(errorMessage);
      // Re-throw the error so the calling component can handle it
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update Product
  const updateProduct = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productApi.updateProduct(id, data);
      await fetchProducts();
      await fetchStats();
      return res.product || res.data;
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to update product";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await productApi.deleteProduct(id);
      await fetchProducts();
      await fetchStats();
      return true;
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to delete product";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Setters for filters, search, sort, page, etc.
  const handleSetFilters = (newFilters) => setFilters(newFilters);
  const handleSetSearch = (value) => setSearch(value);
  const handleSetSort = (value) => setSort(value);
  const handleSetPage = (value) => setPage(value);

  // Context value
  const value = {
    // State
    products,
    stats,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    filters,
    sort,
    search,

    // Actions
    fetchProducts,
    fetchStats,
    createProduct,
    updateProduct,
    deleteProduct,
    setFilters: handleSetFilters,
    setSearch: handleSetSearch,
    setSort: handleSetSort,
    setPage: handleSetPage,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export { ProductContext, ProductProvider };