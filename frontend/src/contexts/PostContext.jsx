import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
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
    status: '',
    category: '',
    tag: '',
    author: '',
    postType: '',
    sortBy: 'publishedAt',
    sortOrder: 'desc'
  });
  const [search, setSearch] = useState('');

  // Fetch all posts (only once on mount)
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await postApi.getAllPosts({
        limit: 1000, // Get all posts for client-side filtering
        sortBy: 'publishedAt',
        sortOrder: 'desc'
      });

      if (response.success && response.data) {
        const { posts } = response.data;
        setPosts(posts || []);
      } else {
        setPosts([]);
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to fetch posts";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Separate function for initial fetch that doesn't depend on filters
  const fetchInitialPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await postApi.getAllPosts({
        limit: 1000, // Get all posts for client-side filtering
        sortBy: 'publishedAt',
        sortOrder: 'desc'
      });

      if (response.success && response.data) {
        const { posts } = response.data;
        setPosts(posts || []);
      } else {
        setPosts([]);
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to fetch posts";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Client-side filtering and pagination
  const getFilteredPosts = useCallback(() => {
    let filtered = posts.filter(post => {
      // Status filter
      if (filters.status && filters.status !== '') {
        if (filters.status === 'featured') {
          // Show only featured posts regardless of their status
          if (!post.featured) {
            return false;
          }
        } else {
          // Regular status filtering
          if (post.status !== filters.status) {
            return false;
          }
        }
      }
      
      // Category filter
      if (filters.category && filters.category !== '') {
        const postCategories = post.categories || [];
        const hasCategory = postCategories.some(cat => 
          (typeof cat === 'object' ? cat._id : cat) === filters.category
        );
        if (!hasCategory) {
          return false;
        }
      }
      
      // Tag filter
      if (filters.tag && filters.tag !== '') {
        const postTags = post.tags || [];
        if (!postTags.some(tag => tag.toLowerCase().includes(filters.tag.toLowerCase()))) {
          return false;
        }
      }
      
      // Author filter
      if (filters.author && filters.author !== '') {
        const authorName = post.author?.name || '';
        if (!authorName.toLowerCase().includes(filters.author.toLowerCase())) {
          return false;
        }
      }
      
      // Post type filter
      if (filters.postType && filters.postType !== '') {
        if (post.postType !== filters.postType) {
          return false;
        }
      }
      
      // Search filter
      if (search) {
        const searchTerm = search.toLowerCase();
        const title = post.title?.toLowerCase() || '';
        const description = post.description?.toLowerCase() || '';
        const tags = (post.tags || []).join(' ').toLowerCase();
        const authorName = post.author?.name?.toLowerCase() || '';
        
        if (!title.includes(searchTerm) && 
            !description.includes(searchTerm) && 
            !tags.includes(searchTerm) &&
            !authorName.includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });

    // Sort the filtered results
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (filters.sortBy) {
          case 'title':
            aValue = a.title || '';
            bValue = b.title || '';
            return filters.sortOrder === 'desc' 
              ? bValue.localeCompare(aValue) 
              : aValue.localeCompare(bValue);
          case 'publishedAt':
            aValue = new Date(a.publishedAt || a.createdAt);
            bValue = new Date(b.publishedAt || b.createdAt);
            return filters.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
          case 'createdAt':
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            return filters.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
          case 'updatedAt':
            aValue = new Date(a.updatedAt);
            bValue = new Date(b.updatedAt);
            return filters.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
          case 'views':
            aValue = a.views || 0;
            bValue = b.views || 0;
            return filters.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [posts, filters.status, filters.category, filters.tag, filters.author, filters.postType, filters.sortBy, filters.sortOrder, search]);

  // Get paginated posts from filtered results
  const getPaginatedPosts = useCallback(() => {
    const filtered = getFilteredPosts();
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return filtered.slice(startIndex, endIndex);
  }, [getFilteredPosts, pagination.page, pagination.limit]);

  // Calculate pagination info from filtered results
  const getPaginationInfo = useCallback(() => {
    const filtered = getFilteredPosts();
    const total = filtered.length;
    const totalPages = Math.ceil(total / pagination.limit);
    return { total, totalPages };
  }, [getFilteredPosts, pagination.limit]);

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

  // Client-side filter actions (no API calls)
  const setFiltersAndFetch = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const setSearchAndFetch = useCallback((newSearch) => {
    setSearch(newSearch);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      status: '',
      category: '',
      tag: '',
      author: '',
      postType: '',
      sortBy: 'publishedAt',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    setSearch('');
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const setPageAndFetch = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  // Toggle like for a post
  const toggleLike = useCallback(async (postId) => {
    try {
      const response = await postApi.toggleLike(postId);
      if (response.success) {
        // Update the post in the local state
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { ...post, likes: response.data.likes }
              : post
          )
        );
        
        // Update featured posts if needed
        setFeaturedPosts(prevFeatured => 
          prevFeatured.map(post => 
            post._id === postId 
              ? { ...post, likes: response.data.likes }
              : post
          )
        );
        
        toast.success(response.data.liked ? 'Post liked!' : 'Post unliked!');
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to toggle like";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Add comment to a post
  const addComment = useCallback(async (postId, commentData) => {
    try {
      const response = await postApi.addComment(postId, commentData);
      if (response.success) {
        // Update the post in the local state
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { ...post, comments: response.data.comments }
              : post
          )
        );
        
        toast.success('Comment added successfully!');
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to add comment";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Fetch post by slug
  const fetchPostBySlug = useCallback(async (slug) => {
    try {
      const response = await postApi.getPostBySlug(slug);
      if (response.success) {
        return response.data;
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err) || "Failed to fetch post";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Fetch posts on mount only
  useEffect(() => {
    fetchPosts();
  }, []); // Empty dependency array - only run on mount

  // Update pagination info when filters change
  useEffect(() => {
    const { total, totalPages } = getPaginationInfo();
    setPagination(prev => ({
      ...prev,
      total,
      totalPages
    }));
  }, [getPaginationInfo]);

  const value = {
    // State
    posts: getPaginatedPosts(), // Return paginated posts
    allPosts: posts, // All posts for reference
    featuredPosts,
    loading,
    error,
    stats,
    pagination: {
      ...pagination,
      ...getPaginationInfo()
    },
    filters,
    search,
    
    // Actions
    fetchPosts,
    fetchInitialPosts,
    fetchFeaturedPosts,
    createPost,
    updatePost,
    deletePost,
    fetchStats,
    setFiltersAndFetch,
    setSearchAndFetch,
    setPageAndFetch,
    clearAllFilters,
    toggleLike,
    addComment,
    fetchPostBySlug,
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
