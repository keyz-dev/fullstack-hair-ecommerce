import React from 'react';
import { ModalWrapper, FormHeader } from '../../ui';
import { formatDate } from '../../../utils/dateUtils';

const ViewPostModal = ({ isOpen, post }) => {
  if (!post || !isOpen) return null;

  return (
    <ModalWrapper>
      <div className="space-y-4">
        <FormHeader
          title="View Post"
          description="View the post details"
        />
        {post.featuredImage && (
          <div>
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
              post.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {post.status}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Featured</label>
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 bg-purple-100 text-purple-800">
              {post.featured ? 'Yes' : 'No'}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <p className="text-sm text-gray-900 mt-1">{post.author?.name || 'Unknown'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Published Date</label>
            <p className="text-sm text-gray-900 mt-1">
              {post.publishedAt ? formatDate(post.publishedAt) : 'Not published'}
            </p>
          </div>
        </div>

        {post.categories && post.categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Categories</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {post.categories.map((category, index) => (
                <span 
                  key={index}
                  className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <div className="mt-1 p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
            <p className="text-sm text-gray-900">{post.content}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <label className="block text-sm font-medium text-gray-700">Views</label>
            <p className="text-lg font-semibold text-gray-900">{post.views || 0}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Likes</label>
            <p className="text-lg font-semibold text-gray-900">{post.likes?.length || 0}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Comments</label>
            <p className="text-lg font-semibold text-gray-900">{post.comments?.length || 0}</p>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ViewPostModal; 