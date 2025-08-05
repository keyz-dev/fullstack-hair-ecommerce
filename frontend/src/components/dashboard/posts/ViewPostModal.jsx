import React from 'react';
import { ModalWrapper, FormHeader } from '../../ui';
import { formatDate } from '../../../utils/dateUtils';
import { 
  Eye, 
  Heart, 
  MessageCircle, 
  Calendar, 
  User, 
  Tag, 
  Play, 
  Image as ImageIcon,
  FileText,
  Star,
  TrendingUp
} from 'lucide-react';

const ViewPostModal = ({ isOpen, post, onClose }) => {
  if (!post || !isOpen) return null;

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
    <ModalWrapper>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Post Details</h2>
              <p className="text-white/80 text-sm">View complete post information</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Post Header */}
          <div className="flex items-start gap-4">
            {/* Media Preview */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
                {mediaType === 'video' ? (
                  <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center relative">
                    {post.video?.thumbnail ? (
                      <img
                        src={post.video.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Play size={32} className="text-red-500" />
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <Play size={16} className="text-red-500" />
                      </div>
                    </div>
                  </div>
                ) : mediaType === 'image' ? (
                  <img
                    src={post.images[0].url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <FileText size={32} className="text-gray-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Post Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-3 line-clamp-2">
                {post.description || post.content?.substring(0, 150) || 'No description available...'}
              </p>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
                  <span className="mr-1">{typeConfig.icon}</span>
                  {typeConfig.label}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                  {post.featured && <Star size={12} className="mr-1" />}
                  {statusConfig.text}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {mediaType === 'video' ? '🎥 Video' : mediaType === 'image' ? '🖼️ Images' : '📝 Text'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <Eye size={20} className="text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{post.views || 0}</div>
              <div className="text-xs text-blue-500">Views</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <Heart size={20} className="text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">{post.likes?.length || 0}</div>
              <div className="text-xs text-red-500">Likes</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <MessageCircle size={20} className="text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{post.comments?.length || 0}</div>
              <div className="text-xs text-green-500">Comments</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {post.featured ? '⭐' : '—'}
              </div>
              <div className="text-xs text-purple-500">Featured</div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <User size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {post.author?.name || 'Unknown'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Published Date</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-900">
                    {post.publishedAt ? formatDate(post.publishedAt) : 'Not published'}
                  </span>
                </div>
              </div>

              {post.categories && post.categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((category, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {post.tags && post.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        <Tag size={12} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {post.callToAction && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Call to Action</label>
                  <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <div className="text-sm font-medium text-accent mb-1">
                      {post.callToAction.text}
                    </div>
                    {post.callToAction.link && (
                      <div className="text-xs text-gray-600 truncate">
                        {post.callToAction.link}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {post.scheduledFor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled For</label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-900">
                      {formatDate(post.scheduledFor)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Content</label>
            <div className="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                {post.content ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <p className="text-gray-500 italic">No content available</p>
                )}
              </div>
            </div>
          </div>

          {/* Media Gallery */}
          {(post.images?.length > 0 || post.video) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Media</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {post.images?.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image.url}
                      alt={`${post.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {post.video && (
                  <div className="aspect-square rounded-lg overflow-hidden bg-red-100 flex items-center justify-center relative">
                    {post.video.thumbnail ? (
                      <img
                        src={post.video.thumbnail}
                        alt={`${post.title} - Video thumbnail`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Play size={32} className="text-red-500" />
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <Play size={16} className="text-red-500" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ViewPostModal; 