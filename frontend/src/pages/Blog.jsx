import React, { useEffect, useState } from 'react';
import { useAuth, usePost } from '../hooks';
import { 
  HeroSection, 
  Button, 
  LoadingSpinner, 
  EmptyState,
  Badge,
  Input,
  Select,
  ModalWrapper
} from '../components/ui';
import { 
  Search, 
  Filter, 
  Heart, 
  MessageCircle, 
  Eye, 
  Share2,
  Calendar,
  User,
  Tag,
  Play
} from 'lucide-react';
import { format } from 'date-fns';
import blogHeroBg from '../assets/images/blog_bg.jpg';

const Blog = () => {
  const { user } = useAuth();
  const {
    posts,
    featuredPosts,
    loading,
    error,
    filters,
    pagination,
    actions
  } = usePost();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  // Load posts on component mount
  useEffect(() => {
    actions.fetchPosts();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    actions.setFilters({ search: searchTerm });
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    actions.setFilters({ [filterType]: value });
  };

  // Handle like toggle
  const handleLikeToggle = async (postId) => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }
    try {
      await actions.toggleLike(postId);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (postId, content) => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }
    try {
      await actions.addComment(postId, { content });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Handle post view
  const handlePostView = async (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
    // Fetch full post data if needed
    try {
      await actions.fetchPostBySlug(post.slug);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  // Handle share
  const handleShare = (post) => {
    const url = `${window.location.origin}/blog/${post.slug}`;
    const text = `Check out this amazing post: ${post.title}`;
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt || post.content.substring(0, 100),
        url: url
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      // Show toast notification
    }
  };

  // Get post type badge color
  const getTypeBadgeColor = (type) => {
    const colors = {
      post: 'blue',
      story: 'purple',
      reel: 'pink',
      transformation: 'green',
      tutorial: 'orange',
      promotion: 'red'
    };
    return colors[type] || 'gray';
  };

  // Render post card
  const PostCard = ({ post }) => (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      {/* Post Image */}
      <div className="relative h-48 overflow-hidden">
        {post.images?.[0] ? (
          <img
            src={post.images[0].url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        
        {/* Video indicator */}
        {post.videos?.length > 0 && (
          <div className="absolute top-2 right-2 bg-black/50 rounded-full p-2">
            <Play size={16} className="text-white" />
          </div>
        )}

        {/* Featured badge */}
        {post.featured && (
          <div className="absolute top-2 left-2">
            <Badge variant="yellow">Featured</Badge>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute bottom-2 left-2">
          <Badge variant={getTypeBadgeColor(post.type)}>
            {post.type}
          </Badge>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar size={14} className="mr-1" />
          {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
          {post.author && (
            <>
              <span className="mx-2">•</span>
              <User size={14} className="mr-1" />
              {post.author.name}
            </>
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt || post.content.substring(0, 150)}...
        </p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="gray" size="sm">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="gray" size="sm">
                +{post.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye size={14} className="mr-1" />
              {post.views}
            </div>
            <div className="flex items-center">
              <Heart size={14} className="mr-1" />
              {post.likes?.length || 0}
            </div>
            <div className="flex items-center">
              <MessageCircle size={14} className="mr-1" />
              {post.comments?.length || 0}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="primary"
            size="sm"
            onClick={() => handlePostView(post)}
          >
            Read More
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLikeToggle(post._id)}
              className={post.likes?.some(like => like.user === user?._id) ? 'text-red-500' : ''}
            >
              <Heart size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare(post)}
            >
              <Share2 size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render featured posts section
  const FeaturedPosts = () => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredPosts.slice(0, 3).map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          title="Failed to Load Posts"
          description={error}
          action={
            <Button onClick={() => actions.fetchPosts()} variant="primary">
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        title="Blog"
        subtitle="Discover amazing content and stories"
        breadcrumbs={['Home', 'Blog']}
        backgroundImage={blogHeroBg}
      >
        <div className="mt-8">
          <p className="text-white/80 text-sm">
            Explore our latest posts, tutorials, and transformations
          </p>
        </div>
      </HeroSection>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && <FeaturedPosts />}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <Select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-40"
              >
                <option value="">All Types</option>
                <option value="post">Posts</option>
                <option value="story">Stories</option>
                <option value="reel">Reels</option>
                <option value="transformation">Transformations</option>
                <option value="tutorial">Tutorials</option>
                <option value="promotion">Promotions</option>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="publishedAt">Latest</option>
                <option value="views">Most Viewed</option>
                <option value="likes">Most Liked</option>
                <option value="comments">Most Commented</option>
              </Select>

              <Select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </Select>

              <Input
                type="number"
                placeholder="Posts per page"
                value={pagination.limit}
                onChange={(e) => actions.setPagination({ limit: parseInt(e.target.value) })}
                min="5"
                max="50"
              />
            </div>
          )}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <EmptyState
              title="No Posts Found"
              description="Try adjusting your search or filters"
              action={
                <Button onClick={() => actions.fetchPosts()} variant="primary">
                  View All Posts
                </Button>
              }
            />
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => actions.fetchPosts(pagination.page - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => actions.fetchPosts(pagination.page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Post Detail Modal */}
      <ModalWrapper>
        {selectedPost && (
          <div className="space-y-6">
            {/* Post Images/Videos */}
            {selectedPost.images?.length > 0 && (
              <div className="relative">
                <img
                  src={selectedPost.images[0].url}
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {selectedPost.videos?.length > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button variant="primary" size="lg">
                      <Play size={24} />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Post Meta */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>{format(new Date(selectedPost.publishedAt), 'MMMM dd, yyyy')}</span>
                {selectedPost.author && (
                  <span>by {selectedPost.author.name}</span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span>{selectedPost.views} views</span>
                <span>{selectedPost.likes?.length || 0} likes</span>
                <span>{selectedPost.comments?.length || 0} comments</span>
              </div>
            </div>

            {/* Post Content */}
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </div>

            {/* Tags */}
            {selectedPost.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedPost.tags.map((tag, index) => (
                  <Badge key={index} variant="gray">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Call to Action */}
            {selectedPost.callToAction?.text && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  {selectedPost.callToAction.text}
                </h3>
                <Button variant="primary" href={selectedPost.callToAction.link}>
                  {selectedPost.callToAction.type === 'booking' ? 'Book Now' : 'Learn More'}
                </Button>
              </div>
            )}

            {/* Engagement Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => handleLikeToggle(selectedPost._id)}
                  className={selectedPost.likes?.some(like => like.user === user?._id) ? 'text-red-500' : ''}
                >
                  <Heart size={16} className="mr-2" />
                  {selectedPost.likes?.length || 0} Likes
                </Button>
                <Button variant="outline" onClick={() => handleShare(selectedPost)}>
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        )}
      </ModalWrapper>
    </>
  );
};

export default Blog;