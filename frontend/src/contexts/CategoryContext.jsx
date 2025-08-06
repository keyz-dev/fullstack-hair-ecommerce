import React, { createContext, useReducer, useCallback, useEffect, useMemo } from "react";
import { categoryApi } from "../api/category";
import { toast } from "react-toastify";

// Initial state
const initialState = {
  categories: [],
  loading: true,
  error: null,
  filters: {
    status: 'all',
    search: '',
    sortBy: 'name'
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0
  },
  stats: {
    total: 0,
    active: 0,
    inactive: 0
  }
};

// Action types
const CATEGORY_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  ADD_CATEGORY: 'ADD_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  REFRESH_CATEGORIES: 'REFRESH_CATEGORIES'
};

// Reducer
const categoryReducer = (state, action) => {
  switch (action.type) {
    case CATEGORY_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case CATEGORY_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case CATEGORY_ACTIONS.SET_CATEGORIES:
      return { 
        ...state, 
        categories: action.payload.categories || [],
        pagination: {
          ...state.pagination,
          total: action.payload.total || action.payload.categories?.length || 0
        },
        loading: false,
        error: null
      };
    
    case CATEGORY_ACTIONS.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 }
      };
    
    case CATEGORY_ACTIONS.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    
    case CATEGORY_ACTIONS.ADD_CATEGORY:
      return {
        ...state,
        categories: [action.payload, ...state.categories]
      };
    
    case CATEGORY_ACTIONS.UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map(cat => 
          cat.id === action.payload.id ? action.payload : cat
        )
      };
    
    case CATEGORY_ACTIONS.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload)
      };
    
    case CATEGORY_ACTIONS.REFRESH_CATEGORIES:
      return { ...state, loading: true, error: null };
    
    default:
      return state;
  }
};

// Create context
const CategoryContext = createContext();

// Provider component
export const CategoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  // Calculate category statistics
  const calculateStats = useCallback((categories) => {
    return {
      total: categories.length,
      active: categories.filter(cat => cat.status === 'active').length,
      inactive: categories.filter(cat => cat.status === 'inactive').length
    };
  }, []);

  // Fetch all categories
  const fetchCategories = useCallback(async (page = 1) => {
    try {
      dispatch({ type: CATEGORY_ACTIONS.SET_LOADING, payload: true });
      
      // Always fetch all categories for client-side filtering
      const response = await categoryApi.getAllCategories();
      
      const fetchedCategories = response.data || [];
      
      dispatch({
        type: CATEGORY_ACTIONS.SET_CATEGORIES,
        payload: { categories: fetchedCategories, total: fetchedCategories.length }
      });
      
    } catch (err) {
      console.error('Error fetching categories:', err);
      const errorMessage = err?.response?.data?.message || 'Failed to load categories. Please try again.';
      dispatch({ type: CATEGORY_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error('Failed to load categories');
    }
  }, []); // Removed pagination dependency

  // Filter and sort categories based on current filters (client-side)
  const getFilteredCategories = useCallback(() => {
    let filtered = state.categories.filter(category => {
      // Status filter
      if (state.filters.status !== 'all' && category.status !== state.filters.status) {
        return false;
      }
      
      // Search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        const categoryName = category.name?.toLowerCase() || '';
        const categoryDescription = category.description?.toLowerCase() || '';
        
        if (!categoryName.includes(searchTerm) && !categoryDescription.includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });

    // Sort the filtered results
    if (state.filters.sortBy) {
      filtered.sort((a, b) => {
        switch (state.filters.sortBy) {
          case 'name':
            return (a.name || '').localeCompare(b.name || '');
          case 'createdAt':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'updatedAt':
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [state.categories, state.filters.status, state.filters.search, state.filters.sortBy]);

  // Get paginated categories from filtered results
  const getPaginatedCategories = useCallback(() => {
    const filteredCategories = getFilteredCategories();
    const startIndex = (state.pagination.page - 1) * state.pagination.limit;
    const endIndex = startIndex + state.pagination.limit;
    return filteredCategories.slice(startIndex, endIndex);
  }, [getFilteredCategories, state.pagination.page, state.pagination.limit]);

  // Calculate pagination info from filtered results
  const getPaginationInfo = useCallback(() => {
    const filteredCategories = getFilteredCategories();
    const total = filteredCategories.length;
    const totalPages = Math.ceil(total / state.pagination.limit);
    
    return {
      total,
      totalPages,
      currentPage: state.pagination.page
    };
  }, [getFilteredCategories, state.pagination.limit, state.pagination.page]);

  // Get category by ID
  const getCategory = useCallback(async (id) => {
    try {
      dispatch({ type: CATEGORY_ACTIONS.SET_LOADING, payload: true });
      const response = await categoryApi.getCategory(id);
      return response;
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Failed to fetch category';
      dispatch({ type: CATEGORY_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error('Failed to fetch category');
      return null;
    } finally {
      dispatch({ type: CATEGORY_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Create category
  const createCategory = useCallback(async (data) => {
    try {
      dispatch({ type: CATEGORY_ACTIONS.SET_LOADING, payload: true });
      
      const response = await categoryApi.createCategory(data);
      const newCategory = response.data || response;
      
      // Add the new category to the state
      dispatch({ type: CATEGORY_ACTIONS.ADD_CATEGORY, payload: newCategory });
      
      return { success: true, message: 'Category created successfully' };
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || 'Failed to create category';
      dispatch({ type: CATEGORY_ACTIONS.SET_ERROR, payload: errorMessage });
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: CATEGORY_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Update category
  const updateCategory = useCallback(async (id, data) => {
    try {
      dispatch({ type: CATEGORY_ACTIONS.SET_LOADING, payload: true });
      
      const response = await categoryApi.updateCategory(id, data);
      const updatedCategory = response.data || response;
      
      dispatch({ type: CATEGORY_ACTIONS.UPDATE_CATEGORY, payload: updatedCategory });
      
      return { success: true, message: 'Category updated successfully' };
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || 'Failed to update category';
      dispatch({ type: CATEGORY_ACTIONS.SET_ERROR, payload: errorMessage });
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: CATEGORY_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Delete category
  const deleteCategory = useCallback(async (id) => {
    try {
      dispatch({ type: CATEGORY_ACTIONS.SET_LOADING, payload: true });
      
      await categoryApi.deleteCategory(id);
      dispatch({ type: CATEGORY_ACTIONS.DELETE_CATEGORY, payload: id });
      
      return { success: true, message: 'Category deleted successfully' };
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || 'Failed to delete category';
      dispatch({ type: CATEGORY_ACTIONS.SET_ERROR, payload: errorMessage });
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: CATEGORY_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Actions
  const actions = {
    // Category management
    addCategory: (category) => {
      dispatch({ type: CATEGORY_ACTIONS.ADD_CATEGORY, payload: category });
    },
    
    updateCategory: (category) => {
      dispatch({ type: CATEGORY_ACTIONS.UPDATE_CATEGORY, payload: category });
    },
    
    deleteCategory: (categoryId) => {
      dispatch({ type: CATEGORY_ACTIONS.DELETE_CATEGORY, payload: categoryId });
    },
    
    // Filter management
    setFilter: (filterType, value) => {
      dispatch({ type: CATEGORY_ACTIONS.SET_FILTERS, payload: { [filterType]: value } });
      // Reset to page 1 when filters change
      dispatch({ type: CATEGORY_ACTIONS.SET_PAGINATION, payload: { page: 1 } });
    },
    
    setSearch: (searchTerm) => {
      dispatch({ type: CATEGORY_ACTIONS.SET_FILTERS, payload: { search: searchTerm } });
      // Reset to page 1 when search changes
      dispatch({ type: CATEGORY_ACTIONS.SET_PAGINATION, payload: { page: 1 } });
    },
    
    // Pagination
    setPage: (page) => {
      dispatch({ type: CATEGORY_ACTIONS.SET_PAGINATION, payload: { page } });
    },
    
    // Refresh categories
    refreshCategories: () => {
      dispatch({ type: CATEGORY_ACTIONS.REFRESH_CATEGORIES });
    }
  };

  // Context value
  const value = {
    ...state,
    filteredCategories: getPaginatedCategories(), // Return paginated filtered categories
    stats: calculateStats(getFilteredCategories()), // Calculate stats from filtered categories
    pagination: {
      ...state.pagination,
      ...getPaginationInfo() // Include calculated pagination info
    },
    actions,
    fetchCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export { CategoryContext };
