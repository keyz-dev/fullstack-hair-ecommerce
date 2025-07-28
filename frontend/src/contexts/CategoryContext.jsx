import React, { createContext, useState, useEffect, useCallback } from "react";
import { categoryApi } from "../api/category";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await categoryApi.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // CRUD and filter methods
  const getCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      return await categoryApi.getCategory(id);
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (data) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "categoryImage" && data[key]) {
        formData.append("categoryImage", data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      await categoryApi.createCategory(formData);
      await fetchCategories()
      return {success: true };
    } catch (err) {
      setError(err);
      return {success: false, error: err.message};
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await categoryApi.updateCategory(id, data);
      setCategories((prev) => prev.map((cat) => (cat.id === id ? updated : cat)));
      return updated;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await categoryApi.deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const filtered = await categoryApi.filterCategories(filters);
      setCategories(filtered);
      return filtered;
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        error,
        
        fetchCategories,
        getCategory,
        createCategory,
        updateCategory,
        deleteCategory,
        filterCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export { CategoryContext };
