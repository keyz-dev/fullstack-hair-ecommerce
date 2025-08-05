import React, { useState } from 'react';
import { Heart, MessageCircle, Eye, Share2, Play, Calendar, User, Tag, Bookmark } from 'lucide-react';
import { Button } from '../ui';
import { format } from 'date-fns';

const PostCard = ({ 
  post, 
  onLike, 
  onShare, 
  onView, 
  onBookmark,
  isLiked = false,
  isBookmarked = false,
  showActions = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  const getStatusConfig = (status, featured) => {
    if (featured) {
      return { text: 'Featured', color: 'bg-purple-100 text-purple-700 border-purple-200' };
    }
    
    switch (status) {
      case 'published':
        return { text: 'Published', color: 'bg-green-100 text-green-700 border-green-200' };
      case 'draft':
        return { text: 'Draft', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
      default:
        return { text: 'Draft', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    }
  };

  const typeConfig = getPostTypeConfig(post.postType);
  const statusConfig = getStatusConfig(post.status, post.featured);
  const mediaType = getMediaType();

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-[1.02] hover:border-accent/20 ${
        isHovered ? 'ring-2 ring-accent/20' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {mediaType === 'video' ? (
          <div className="relative w-full h-full">
            {post.video?.thumbnail ? (
              <img
                src={post.video.thumbnail}
                alt={post.title}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <Play size={48} className="text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <Play size={24} className="text-accent" />
              </div>
            </div>
          </div>
        ) : mediaType === 'image' ? (
          <img
            src={post.images[0].url}
            alt={post.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/10 to-purple-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-sm text-gray-500">Text Post</div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {!imageLoaded && mediaType !== 'text' && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {post.featured && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
              ⭐ Featured
            </div>
          )}
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
            <span className="mr-1">{typeConfig.icon}</span>
            {typeConfig.label}
          </div>
        </div>

        {/* Media Type Indicator */}
        <div className="absolute top-3 right-3">
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
            {mediaType === 'video' ? '🎥' : mediaType === 'image' ? '🖼️' : '📝'}
          </div>
        </div>

        {/* Quick Actions Overlay */}
        {showActions && (
          <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex gap-3">
              <Button
                onClickHandler={() => onView(post)}
                text="View Post"
                additionalClasses="bg-white text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-xl shadow-lg"
              />
              <Button
                onClickHandler={() => onShare(post)}
                additionalClasses="bg-white/20 text-white hover:bg-white/30 p-3 rounded-xl backdrop-blur-sm"
              >
                <Share2 size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {format(new Date(post.publishedAt || post.createdAt), 'MMM dd, yyyy')}
            </div>
            {post.author && (
              <div className="flex items-center gap-1">
                <User size={14} />
                {post.author.name}
              </div>
            )}
          </div>
          {post.status && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
              {statusConfig.text}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-300">
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {post.description || post.content?.substring(0, 120) || 'No description available...'}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-accent/10 hover:text-accent transition-colors duration-300"
              >
                <Tag size={12} className="mr-1" />
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span className="font-medium">{post.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={14} className={isLiked ? 'text-red-500 fill-current' : ''} />
              <span className="font-medium">{post.likes?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={14} />
              <span className="font-medium">{post.comments?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Button
                onClickHandler={() => onLike(post._id)}
                additionalClasses={`p-2 rounded-lg transition-all duration-300 ${
                  isLiked 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
              </Button>
              <Button
                onClickHandler={() => onBookmark(post._id)}
                additionalClasses={`p-2 rounded-lg transition-all duration-300 ${
                  isBookmarked 
                    ? 'bg-accent/10 text-accent' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
              </Button>
            </div>
            <Button
              onClickHandler={() => onView(post)}
              text="Read More"
              additionalClasses="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard; 