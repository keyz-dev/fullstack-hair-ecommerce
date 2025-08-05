import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, Play, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { Button } from '../ui';
import { format } from 'date-fns';

const PostCard = ({ 
  post, 
  onLike, 
  isLiked = false,
  simplified = false,
  viewMode = 'grid'
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

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

  const handleCardClick = (e) => {
    // Don't trigger card click if clicking on like button or other interactive elements
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    // Navigate to the blog post detail page
    navigate(`/blog/${post.slug || post._id}`);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onLike(post._id);
  };

  if (viewMode === 'list') {
    return (
      <div
        className={`group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer ${
          isHovered ? 'ring-1 ring-accent/20' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <div className="flex">
          {/* Media Section */}
          <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden bg-gray-100">
            {mediaType === 'video' ? (
              <div className="relative w-full h-full">
                {post.video?.thumbnail ? (
                  <img
                    src={post.video.thumbnail}
                    alt={post.title}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      isHovered ? 'scale-105' : 'scale-100'
                    }`}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Play size={32} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-2 shadow-lg">
                    <Play size={20} className="text-accent" />
                  </div>
                </div>
              </div>
            ) : mediaType === 'image' ? (
              <img
                src={post.images[0].url}
                alt={post.title}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isHovered ? 'scale-105' : 'scale-100'
                }`}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent/10 to-purple-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-1">📝</div>
                  <div className="text-xs text-gray-600">Text Post</div>
                </div>
              </div>
            )}

            {/* Post Type Badge */}
            <div className="absolute top-2 left-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
                <span>{typeConfig.icon}</span>
                <span>{typeConfig.label}</span>
              </span>
            </div>

            {/* Featured Badge */}
            {post.featured && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  ⭐ Featured
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 flex flex-col">
            <div className="flex-grow">
              {/* Title */}
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors line-clamp-1">
                {post.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {post.description || post.content?.substring(0, 200)}
              </p>

              {/* Meta Information */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar size={12} />
                  <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={12} />
                  <span>{post.views || 0}</span>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                    >
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 text-sm text-accent group-hover:text-accent/80 transition-colors">
                <span>Read more</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
              
              {!simplified && (
                <button
                  onClick={handleLikeClick}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm transition-colors ${
                    isLiked 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={14} className={isLiked ? 'fill-current' : ''} />
                  <span>{post.likes || 0}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div
      className={`group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer ${
        isHovered ? 'ring-1 ring-accent/20' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Media Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {mediaType === 'video' ? (
          <div className="relative w-full h-full">
            {post.video?.thumbnail ? (
              <img
                src={post.video.thumbnail}
                alt={post.title}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isHovered ? 'scale-105' : 'scale-100'
                }`}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <Play size={32} className="text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white/90 rounded-full p-2 shadow-lg">
                <Play size={20} className="text-accent" />
              </div>
            </div>
          </div>
        ) : mediaType === 'image' ? (
          <img
            src={post.images[0].url}
            alt={post.title}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/10 to-purple-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-sm text-gray-600">Text Post</div>
            </div>
          </div>
        )}

        {/* Post Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
            <span>{typeConfig.icon}</span>
            <span>{typeConfig.label}</span>
          </span>
        </div>

        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              ⭐ Featured
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {post.description || post.content?.substring(0, 120)}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={12} />
            <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={12} />
            <span>{post.views || 0}</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{post.tags.length - 2} more</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-accent group-hover:text-accent/80 transition-colors">
            <span>Read more</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
          
          {!simplified && (
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm transition-colors ${
                isLiked 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart size={14} className={isLiked ? 'fill-current' : ''} />
              <span>{post.likes || 0}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard; 