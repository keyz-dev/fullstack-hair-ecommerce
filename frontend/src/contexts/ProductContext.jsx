import React, { createContext, useState, useCallback } from "react";
import { productApi } from "../api/product";

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
      setError(err?.response?.data?.message || "Failed to fetch products");
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
      setError(err?.response?.data?.message || "Failed to fetch product stats");
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
      } else {
        formData.append(key, data[key]);
      }
    });

    Object.keys(formData.entries()).forEach((key) => {
      console.log(key, formData.get(key));
    });

    try {
      const res = await productApi.addProduct(formData);
      await fetchProducts();
      await fetchStats();
      return res;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create product");
      return null;
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
      setError(err?.response?.data?.message || "Failed to update product");
      return null;
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
      setError(err?.response?.data?.message || "Failed to delete product");
      return false;
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