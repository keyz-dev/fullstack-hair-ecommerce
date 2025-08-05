import React, { useState, useEffect } from 'react';
import { X, Play, Pause, ChevronLeft, ChevronRight, Heart, Eye, Calendar, User, Tag, Share2 } from 'lucide-react';
import { Button } from '../ui';
import { format } from 'date-fns';

const BlogPostDetail = ({ post, isOpen, onClose, onLike, isLiked = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoRef, setVideoRef] = useState(null);

  const getMediaType = () => {
    if (post.video) return 'video';
    if (post.images && post.images.length > 0) return 'image';
    return 'text';
  };

  const getPostTypeConfig = (postType) => {
    const configs = {
      'work-showcase': { icon: '🎨', label: 'Work Showcase', color: 'bg-indigo-100 text-indigo-700' },
      'tutorial': { icon: '📚', label: 'Tutorial', color: 'bg-blue-100 text-blue-700' },
      'product-review': { icon: '⭐', label: 'Product Review', color: 'bg-yellow-100 text-yellow-700' },
      'styling-tip': { icon: '💡', label: 'Styling Tip', color: 'bg-green-100 text-green-700' },
      'transformation': { icon: '✨', label: 'Transformation', color: 'bg-purple-100 text-purple-700' },
      'technique-demo': { icon: '🎯', label: 'Technique Demo', color: 'bg-orange-100 text-orange-700' },
      'promotion': { icon: '🎉', label: 'Promotion', color: 'bg-pink-100 text-pink-700' }
    };
    
    return configs[postType] || { icon: '📄', label: postType?.replace('-', ' ') || 'Post', color: 'bg-gray-100 text-gray-700' };
  };

  const typeConfig = getPostTypeConfig(post.postType);
  const mediaType = getMediaType();

  // Auto-cycle through images every 5 seconds (only for image type with multiple images)
  useEffect(() => {
    if (mediaType !== 'image' || post.images.length <= 1) return;
    
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextImage();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImageIndex, isTransitioning, mediaType, post.images.length]);

  const nextImage = () => {
    if (!isTransitioning && post.images.length > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 600);
    }
  };

  const prevImage = () => {
    if (!isTransitioning && post.images.length > 1) {
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
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
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row h-full">
          {/* Media Section */}
          <div className="lg:w-2/3 relative">
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

          {/* Content Section */}
          <div className="lg:w-1/3 p-6 overflow-y-auto">
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
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

            {/* Description */}
            <p className="text-gray-600 mb-4 leading-relaxed">
              {post.description || post.content}
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

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClickHandler={() => onLike(post._id)}
                text={`${isLiked ? 'Liked' : 'Like'} ${post.likes || 0}`}
                additionalClasses={`flex items-center gap-2 ${
                  isLiked 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
              </Button>
              
              <Button
                onClickHandler={handleShare}
                text="Share"
                additionalClasses="flex items-center gap-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <Share2 size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail; 