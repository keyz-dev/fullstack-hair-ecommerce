import React, { createContext, useState, useCallback } from 'react';
import { postApi } from '../api/post';
import { toast } from 'react-toastify';
import { extractErrorMessage } from '../utils/extractError';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: 'published',
    category: '',
    tag: '',
    featured: '',
    author: '',
    sortBy: 'publishedAt',
    sortOrder: 'desc'
  });
  const [search, setSearch] = useState('');

  const fetchPosts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        search,
        status: filters.status,
        category: filters.category,
        tag: filters.tag,
        featured: filters.featured,
        author: filters.author,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...params,
      };
      
      const response = await postApi.getAllPosts(queryParams);

      if (response.success && response.data) {
        const { posts, pagination: newPagination } = response.data;
        setPosts(posts || []);
        setPagination(prev => ({
          ...prev,
          page: newPagination.currentPage || 1,
          totalPages: newPagination.totalPages || 1,
          total: newPagination.total || 0,
        }));
      } else {
        // Handle cases where the API call might not be successful
        setPosts([]);
        setPagination(prev => ({ ...prev, page: 1, totalPages: 1, total: 0 }));
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to fetch posts";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, filters.status, filters.category, filters.tag, filters.featured, filters.author, filters.sortBy, filters.sortOrder]);

  const fetchFeaturedPosts = useCallback(async (limit = 6) => {
    try {
      const response = await postApi.getFeaturedPosts(limit);
      // Backend returns { posts }
      setFeaturedPosts(response.posts || []);
      return response;
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to fetch featured posts";
      toast.error(errorMessage);
      return null;
    }
  }, []);

  const createPost = useCallback(async (postData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postApi.createPost(postData);
      if (response.success) {
        await fetchPosts();
        await fetchFeaturedPosts();
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Failed to create post' };
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to create post";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [fetchFeaturedPosts, fetchPosts]);

  const updatePost = useCallback(async (id, postData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postApi.updatePost(id, postData);
      // Backend returns { message, post }
      setPosts(prev => prev.map(post => 
        post._id === id ? response.post : post
      ));
      toast.success(response.message || "Post updated successfully");
      return response;
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to update post";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postApi.deletePost(id);
      // Backend returns { message }
      setPosts(prev => prev.filter(post => post._id !== id));
      toast.success(response.message || "Post deleted successfully");
      return true;
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to delete post";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await postApi.getPostStats();
      setStats({
        total: data.totalPosts || 0,
        featured: data.featuredPosts || 0,
        totalViews: data.totalViews || 0,
        totalLikes: data.totalLikes || 0,
        totalComments: data.totalComments || 0,
      });
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to fetch post stats";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const setFiltersAndFetch = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchPosts({ page: 1 });
  }, [fetchPosts]);

  const setSearchAndFetch = useCallback((newSearch) => {
    setSearch(newSearch);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchPosts({ page: 1 });
  }, [fetchPosts]);

  const setPageAndFetch = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
    fetchPosts({ page });
  }, [fetchPosts]);

  const value = {
    // State
    posts,
    featuredPosts,
    loading,
    error,
    stats,
    pagination,
    filters,
    search,
    
    // Actions
    fetchPosts,
    fetchFeaturedPosts,
    createPost,
    updatePost,
    deletePost,
    fetchStats,
    setFiltersAndFetch,
    setSearchAndFetch,
    setPageAndFetch,
    setError: (error) => setError(error),
    clearError: () => setError(null)
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};

export { PostContext};
