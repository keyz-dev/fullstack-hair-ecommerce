import React, { useState, useEffect } from 'react';
import { usePost } from '../../hooks/usePost';
import { useCategory } from '../../hooks/useCategory';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import BlogFilters from './BlogFilters';
import PostCard from './PostCard';
import BlogPostDetail from './BlogPostDetail';
import { EmptyState, Pagination } from '../ui';
import blogHeroBg from '../../assets/images/blog_bg.jpg';

const BlogPage = () => {
  const { user } = useAuth();
  const { categories } = useCategory();
  const {
    posts,
    loading,
    error,
    stats,
    pagination,
    filters,
    setFiltersAndFetch,
    setSearchAndFetch,
    setPageAndFetch,
    clearAllFilters,
    toggleLike,
    fetchPosts
  } = usePost();

  const [searchTerm, setSearchTerm] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Initialize posts on mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setSearchAndFetch(term);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFiltersAndFetch({ ...filters, [key]: value });
  };

  // Handle like toggle
  const handleLikeToggle = async (postId) => {
    if (!user) {
      toast.info('Please login to like posts');
      return;
    }

    try {
      await toggleLike(postId);
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error liking post:', error); 
      toast.error('Failed to like post');
    }
  };

  // Handle post view
  const handlePostView = (post) => {
    setSelectedPost(post);
    setIsDetailModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsDetailModalOpen(false);
    setSelectedPost(null);
  };

  // Loading skeleton
  const PostSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-5 bg-gray-200 rounded mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="flex gap-2 mb-3">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-5 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  if (error && posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          title="Failed to Load Posts"
          description={error}
          action={
            <button
              onClick={fetchPosts}
              className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Try Again
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 py-16">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${blogHeroBg})` }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <nav className="flex justify-center mb-4">
              <ol className="flex items-center space-x-2 text-sm text-white/80">
                <li><a href="/" className="hover:text-white">Home</a></li>
                <li>/</li>
                <li>Blog</li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog & Tutorials</h1>
            <p className="text-xl text-white/80 mb-4">Discover hair styling tips, transformations, and professional insights</p>
            <p className="text-white/60 text-sm">
              {stats.totalPosts} posts available
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <BlogFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onClearFilters={clearAllFilters}
        categories={categories}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewChange={setViewMode}
      />

      {/* Filter Stats */}
      {filters.status || filters.category || filters.postType || searchTerm ? (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>
                  Showing {posts.length} posts
                  {searchTerm && ` for "${searchTerm}"`}
                </span>
                <span className="bg-accent text-white px-2 py-1 rounded-full text-xs">
                  Filtered
                </span>
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  clearAllFilters();
                }}
                className="text-accent hover:text-accent/80 underline text-sm"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Posts Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {Array.from({ length: 6 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            title="No Posts Found"
            description={
              searchTerm 
                ? `No posts found for "${searchTerm}". Try adjusting your search terms.`
                : "No posts available at the moment. Check back soon!"
            }
            action={
              <button
                onClick={() => {
                  setSearchTerm('');
                  clearAllFilters();
                }}
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
              >
                View All Posts
              </button>
            }
          />
        ) : (
          <>
            <div className={`grid gap-6 mb-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={handleLikeToggle}
                  onView={handlePostView}
                  isLiked={likedPosts.has(post._id)}
                  simplified={true}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPageAndFetch}
                />
              </div>
            )}
          </>
        )}
      </section>

      {/* Blog Post Detail Modal */}
      {selectedPost && (
        <BlogPostDetail
          post={selectedPost}
          isOpen={isDetailModalOpen}
          onClose={handleModalClose}
          onLike={handleLikeToggle}
          isLiked={likedPosts.has(selectedPost._id)}
        />
      )}
    </div>
  );
};

export default BlogPage; 