import React from 'react';
import { Calendar, Eye, Tag } from 'lucide-react';
import { format } from 'date-fns';

const PostCardContent = ({ post, typeConfig, compact = false }) => {
  const titleClasses = compact 
    ? 'font-semibold text-gray-900 mb-2 group-hover:text-accent transition-colors line-clamp-1'
    : 'font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-accent transition-colors';
  
  const descriptionClasses = compact
    ? 'text-gray-600 text-sm mb-3 line-clamp-2'
    : 'text-gray-600 text-sm mb-3 line-clamp-2';
  
  const metaClasses = 'flex items-center justify-between text-xs text-gray-500 mb-3';
  const tagClasses = 'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600';
  
  const maxTags = compact ? 3 : 2;
  const descriptionLength = compact ? 200 : 120;

  return (
    <div className={compact ? 'flex-grow' : ''}>
      {/* Title */}
      <h3 className={titleClasses}>
        {post.title}
      </h3>

      {/* Description */}
      <p className={descriptionClasses}>
        {post.description || post.content?.substring(0, descriptionLength)}
      </p>

      {/* Meta Information */}
      <div className={metaClasses}>
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
          {post.tags.slice(0, maxTags).map((tag, index) => (
            <span
              key={index}
              className={tagClasses}
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
          {post.tags.length > maxTags && (
            <span className="text-xs text-gray-500">+{post.tags.length - maxTags} more</span>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCardContent; 