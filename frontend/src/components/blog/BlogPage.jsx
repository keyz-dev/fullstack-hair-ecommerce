import React, { useState, useEffect } from 'react';
import { usePost } from '../../hooks/usePost';
import { useCategory } from '../../hooks/useCategory';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import BlogHero from './BlogHero';
import BlogFilters from './BlogFilters';
import PostCard from './PostCard';
import { LoadingSpinner, EmptyState, Pagination } from '../ui';
import { Share2, Bookmark, Heart, Eye, MessageCircle } from 'lucide-react';

const BlogPage = () => {
  const { user } = useAuth();
  const { categories } = useCategory();
  const {
    posts,
    featuredPosts,
    loading,
    error,
    stats,
    pagination,
    filters,
    search,
    setFiltersAndFetch,
    setSearchAndFetch,
    setPageAndFetch,
    clearAllFilters,
    toggleLike,
    fetchPosts
  } = usePost();

  const [searchTerm, setSearchTerm] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());

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
      toast.error('Failed to like post');
    }
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = (postId) => {
    if (!user) {
      toast.info('Please login to bookmark posts');
      return;
    }

    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        toast.success('Removed from bookmarks');
      } else {
        newSet.add(postId);
        toast.success('Added to bookmarks');
      }
      return newSet;
    });
  };

  // Handle share
  const handleShare = (post) => {
    const url = `${window.location.origin}/blog/${post.slug}`;
    const text = `Check out this amazing post: ${post.title}`;
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description || post.content?.substring(0, 100),
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  // Handle post view
  const handlePostView = (post) => {
    // Navigate to post detail page or open modal
    window.open(`/blog/${post.slug}`, '_blank');
  };

  // Loading skeleton
  const PostSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-200 rounded mb-3"></div>
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  // Featured posts section
  const FeaturedPosts = () => {
    if (!featuredPosts || featuredPosts.length === 0) return null;

    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Posts</h2>
            <p className="text-gray-600">Handpicked content you don't want to miss</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Eye size={16} />
            <span>Most viewed and loved</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.slice(0, 3).map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLikeToggle}
              onShare={handleShare}
              onView={handlePostView}
              onBookmark={handleBookmarkToggle}
              isLiked={likedPosts.has(post._id)}
              isBookmarked={bookmarkedPosts.has(post._id)}
            />
          ))}
        </div>
      </section>
    );
  };

  // All posts section
  const AllPosts = () => (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">All Posts</h2>
          <p className="text-gray-600">
            {posts.length} posts found
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Eye size={16} />
            <span>{stats.totalViews || 0} total views</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart size={16} />
            <span>{stats.totalLikes || 0} total likes</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              className="bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors"
            >
              View All Posts
            </button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onLike={handleLikeToggle}
                onShare={handleShare}
                onView={handlePostView}
                onBookmark={handleBookmarkToggle}
                isLiked={likedPosts.has(post._id)}
                isBookmarked={bookmarkedPosts.has(post._id)}
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
              className="bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors"
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
      <BlogHero 
        onSearch={handleSearch}
        stats={stats}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <BlogFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClearFilters={clearAllFilters}
          categories={categories}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          stats={stats}
        />

        {/* Featured Posts */}
        <FeaturedPosts />

        {/* All Posts */}
        <AllPosts />
      </div>
    </div>
  );
};

export default BlogPage; 