import React from 'react';
import { Play } from 'lucide-react';
import { getMediaType } from '../../utils/postUtils';

const PostCardMedia = ({ post, isHovered, typeConfig, featured, compact = false }) => {
  // Add null safety check
  if (!post) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <div className="text-center">
          <div className={`${compact ? 'text-2xl mb-1' : 'text-4xl mb-2'}`}>📝</div>
          <div className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>Loading...</div>
        </div>
      </div>
    );
  }

  const mediaType = getMediaType(post);
  const topPosition = compact ? 'top-2' : 'top-3';
  const leftPosition = compact ? 'left-2' : 'left-3';
  const rightPosition = compact ? 'right-2' : 'right-3';

  return (
    <>
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
              <Play size={compact ? 24 : 32} className="text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-2 shadow-lg">
              <Play size={compact ? 16 : 20} className="text-accent" />
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
            <div className={`${compact ? 'text-2xl mb-1' : 'text-4xl mb-2'}`}>📝</div>
            <div className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>Text Post</div>
          </div>
        </div>
      )}

      {/* Post Type Badge */}
      <div className={`absolute ${topPosition} ${leftPosition}`}>
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
          <span>{typeConfig.icon}</span>
          <span>{typeConfig.label}</span>
        </span>
      </div>

      {/* Featured Badge */}
      {featured && (
        <div className={`absolute ${topPosition} ${rightPosition}`}>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            ⭐ Featured
          </span>
        </div>
      )}
    </>
  );
};

export default PostCardMedia; 