import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';

const PostCardActions = ({ post, isLiked, simplified, onLike, compact = false }) => {
  const containerClasses = compact 
    ? 'flex items-center justify-between mt-auto'
    : 'flex items-center justify-between';

  return (
    <div className={containerClasses}>
      <div className="flex items-center gap-2 text-sm text-accent group-hover:text-accent/80 transition-colors">
        <span>Read more</span>
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
      
      {!simplified && (
        <button
          onClick={onLike}
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
  );
};

export default PostCardActions; 