import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCardMedia from './PostCardMedia';
import PostCardContent from './PostCardContent';
import PostCardActions from './PostCardActions';
import { getPostTypeConfig } from '../../utils/postUtils';

const PostCard = ({ 
  post, 
  onLike, 
  isLiked = false,
  simplified = false,
  viewMode = 'grid'
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const typeConfig = getPostTypeConfig(post.postType);

  const handleCardClick = (e) => {
    // Don't trigger card click if clicking on like button or other interactive elements
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    // Navigate to the blog post detail page
    navigate(`/blog/${post._id}`);
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
            <PostCardMedia 
              post={post} 
              isHovered={isHovered}
              typeConfig={typeConfig}
              featured={post.featured}
              compact={true}
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 flex flex-col">
            <PostCardContent 
              post={post}
              typeConfig={typeConfig}
              compact={true}
            />
            
            {/* Actions */}
            <PostCardActions 
              post={post}
              isLiked={isLiked}
              simplified={simplified}
              onLike={handleLikeClick}
              compact={true}
            />
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
        <PostCardMedia 
          post={post} 
          isHovered={isHovered}
          typeConfig={typeConfig}
          featured={post.featured}
        />
      </div>

      {/* Content Section */}
      <div className="p-4">
        <PostCardContent 
          post={post}
          typeConfig={typeConfig}
        />
        
        {/* Actions */}
        <PostCardActions 
          post={post}
          isLiked={isLiked}
          simplified={simplified}
          onLike={handleLikeClick}
        />
      </div>
    </div>
  );
};

export default PostCard; 