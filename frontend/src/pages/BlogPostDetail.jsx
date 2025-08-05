import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Eye, Calendar, Tag, Share2, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui';
import { format } from 'date-fns';
import { useAuth, usePost } from '../hooks';
import { toast } from 'react-toastify';
import { getPostTypeConfig, getMediaType } from '../utils/postUtils';

const BlogPostDetail = () => {
  const { postId } = useParams();

  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchPostById, toggleLike } = usePost();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoRef, setVideoRef] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetchPostById(postId, user?._id);
        setPost(response);
        setLikesCount(response.likes?.length || 0);
        setIsLiked(response.userLiked || false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, user?._id]);

  // Auto-cycle through images every 5 seconds (only for image type with multiple images)
  useEffect(() => {
    if (!post || getMediaType(post) !== 'image' || !post?.images || post.images.length <= 1) return;
    
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextImage();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImageIndex, isTransitioning, post]);

  const nextImage = () => {
    if (!isTransitioning && post?.images && post.images.length > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 600);
    }
  };

  const prevImage = () => {
    if (!isTransitioning && post?.images && post.images.length > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 600);
    }
  };

  const handleVideoToggle = () => {
    if (videoRef) {
      if (isVideoPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
  };

  const handleLike = async () => {
    if (!user) {
      toast.info('Please login to like posts');
      return;
    }

    if (!post?._id) {
      toast.error('Post not available');
      return;
    }

    try {
      await toggleLike(post._id);
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The post you are looking for does not exist.'}</p>
          <div className="space-y-3">
            <Button
              onClickHandler={() => navigate('/blog')}
              text="Back to Blog"
              additionalClasses="bg-accent text-white"
            />
            <Button
              onClickHandler={() => navigate('/')}
              text="Go Home"
              additionalClasses="bg-gray-100 text-gray-700"
            />
          </div>
        </div>
      </div>
    );
  }

  const typeConfig = getPostTypeConfig(post?.postType);
  const mediaType = getMediaType(post);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Blog</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isLiked 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                <span>{likesCount}</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Media Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {mediaType === 'video' ? (
                <div className="relative aspect-video bg-black">
                  <video
                    ref={setVideoRef}
                    src={post.video.url}
                    poster={post.video.thumbnail}
                    className="w-full h-full object-contain"
                    onEnded={handleVideoEnded}
                    controls
                  />
                </div>
              ) : mediaType === 'image' ? (
                <div className="relative aspect-video bg-gray-100">
                  {/* Background Images with Fade Animation */}
                  <div className="absolute inset-0">
                    {post.images.map((image, index) => (
                      <div
                        key={image._id || index}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                          index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ backgroundImage: `url(${image.url})` }}
                      />
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  {post.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {/* Image Indicators */}
                  {post.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {post.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (!isTransitioning && index !== currentImageIndex) {
                              setIsTransitioning(true);
                              setTimeout(() => {
                                setCurrentImageIndex(index);
                                setTimeout(() => setIsTransitioning(false), 100);
                              }, 600);
                            }
                          }}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex
                              ? 'bg-accent scale-125'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-accent/10 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <div className="text-xl text-gray-600">Text Post</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
                  <span>{typeConfig.icon}</span>
                  <span>{typeConfig.label}</span>
                </span>
                {post.featured && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    ⭐ Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>{post.views || 0}</span>
                </div>
              </div>

              {/* Author */}
              {post.author && (
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={post.author.avatar || '/default-avatar.png'}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{post.author.name}</p>
                    <p className="text-sm text-gray-500">Author</p>
                    {post.author.bio && (
                      <p className="text-xs text-gray-600 mt-1">{post.author.bio}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-gray-600 mb-4 leading-relaxed">
                {post.description}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Full Content */}
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {post.content || post.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail; 