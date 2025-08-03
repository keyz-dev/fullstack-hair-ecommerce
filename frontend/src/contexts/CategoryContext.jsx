import React, { createContext, useReducer, useCallback, useEffect } from "react";
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
      
      const response = await categoryApi.getAllCategories({
        page,
        limit: state.pagination.limit,
        status: state.filters.status !== 'all' ? state.filters.status : undefined,
        search: state.filters.search || undefined,
        sortBy: state.filters.sortBy
      });
      
      const fetchedCategories = response.data || [];
      const totalCategories = response.pagination?.total || fetchedCategories.length;
      
      dispatch({
        type: CATEGORY_ACTIONS.SET_CATEGORIES,
        payload: { categories: fetchedCategories, total: totalCategories }
      });
      
    } catch (err) {
      console.error('Error fetching categories:', err);
      const errorMessage = err?.response?.data?.message || 'Failed to load categories. Please try again.';
      dispatch({ type: CATEGORY_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error('Failed to load categories');
    }
  }, [state.pagination.limit, state.filters]);

  // Filter categories based on current filters (client-side)
  const getFilteredCategories = useCallback(() => {
    return state.categories.filter(category => {
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
  }, [state.categories, state.filters]);

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
      
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "categoryImage" && data[key]) {
          formData.append("categoryImage", data[key]);
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await categoryApi.createCategory(formData);
      
      // Add the new category to the state
      dispatch({ type: CATEGORY_ACTIONS.ADD_CATEGORY, payload: response.data || response });
      
      toast.success('Category created successfully');
      return { success: true };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Failed to create category';
      dispatch({ type: CATEGORY_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error('Failed to create category');
      return { success: false, error: errorMessage };
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
      
      toast.success('Category updated successfully');
      return updatedCategory;
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Failed to update category';
      dispatch({ type: CATEGORY_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error('Failed to update category');
      return null;
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
      
      toast.success('Category deleted successfully');
      return true;
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Failed to delete category';
      dispatch({ type: CATEGORY_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error('Failed to delete category');
      return false;
    } finally {
      dispatch({ type: CATEGORY_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Actions
  const actions = {
    // Filter management
    setFilter: (filterType, value) => {
      dispatch({ type: CATEGORY_ACTIONS.SET_FILTERS, payload: { [filterType]: value } });
    },
    
    setSearch: (searchTerm) => {
      dispatch({ type: CATEGORY_ACTIONS.SET_FILTERS, payload: { search: searchTerm } });
    },
    
    // Pagination
    setPage: (page) => {
      dispatch({ type: CATEGORY_ACTIONS.SET_PAGINATION, payload: { page } });
    },
    
    // Refresh categories
    refreshCategories: () => {
      dispatch({ type: CATEGORY_ACTIONS.REFRESH_CATEGORIES });
    },
    
    // Clear all filters
    clearAllFilters: () => {
      dispatch({ type: CATEGORY_ACTIONS.SET_FILTERS, payload: initialState.filters });
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Context value
  const value = {
    ...state,
    filteredCategories: getFilteredCategories(),
    stats: calculateStats(state.categories),
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
