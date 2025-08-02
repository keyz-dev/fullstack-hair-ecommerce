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
    published: 0,
    draft: 0,
    featured: 0,
    byCategory: []
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
      
      // Backend returns { posts, totalPages, currentPage, total, hasNext, hasPrev }
      setPosts(response.posts || []);
      setPagination(prev => ({
        ...prev,
        page: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        total: response.total || 0,
      }));
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
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to create post";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

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
    try {
      // This would be implemented when backend provides post stats
      // For now, we'll calculate basic stats from posts
      // We'll use the current posts state directly without dependency
      setStats(() => {
        const total = posts.length;
        const published = posts.filter(post => post.status === 'published').length;
        const draft = posts.filter(post => post.status === 'draft').length;
        const featured = posts.filter(post => post.featured).length;
        
        return {
          total,
          published,
          draft,
          featured,
          byCategory: []
        };
      });
    } catch (err) {
      console.error('Error fetching post stats:', err);
    }
  }, []); // Remove posts dependency to prevent circular dependency

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
