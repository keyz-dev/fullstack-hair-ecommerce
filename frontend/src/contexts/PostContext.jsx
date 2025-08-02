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
        ...filters,
        ...params,
      };
      
      const response = await postApi.getAllPosts(queryParams);
      
      if (response.success) {
        setPosts(response.posts || []);
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            page: response.pagination.page,
            totalPages: response.pagination.totalPages,
            total: response.pagination.total,
          }));
        }
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to fetch posts";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, filters]);

  const fetchFeaturedPosts = useCallback(async (limit = 6) => {
    try {
      const response = await postApi.getFeaturedPosts(limit);
      if (response.success) {
        setFeaturedPosts(response.posts || []);
      }
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
        setPosts(prev => [response.post, ...prev]);
        toast.success("Post created successfully");
        return response;
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to create post";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (id, postData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postApi.updatePost(id, postData);
      if (response.success) {
        setPosts(prev => prev.map(post => 
          post._id === id ? response.post : post
        ));
        toast.success("Post updated successfully");
        return response;
      }
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
      if (response.success) {
        setPosts(prev => prev.filter(post => post._id !== id));
        toast.success("Post deleted successfully");
        return true;
      }
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
      const total = posts.length;
      const published = posts.filter(post => post.status === 'published').length;
      const draft = posts.filter(post => post.status === 'draft').length;
      const featured = posts.filter(post => post.featured).length;
      
      setStats({
        total,
        published,
        draft,
        featured,
        byCategory: []
      });
    } catch (err) {
      console.error('Error fetching post stats:', err);
    }
  }, [posts]);

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
