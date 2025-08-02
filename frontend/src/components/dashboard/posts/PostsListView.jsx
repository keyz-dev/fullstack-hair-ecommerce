import React from 'react';
import { usePost } from '../../../hooks';
import { Button, LoadingSpinner } from '../../ui';
import { formatDate } from '../../../utils/dateUtils';

const PostsListView = ({ onEdit, onView, onDelete }) => {
  const { posts, loading, pagination, setPageAndFetch } = usePost();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!posts.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No posts found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {post.featuredImage ? (
                        <img 
                          className="h-10 w-10 rounded-lg object-cover" 
                          src={post.featuredImage} 
                          alt={post.title} 
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">📝</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {post.excerpt?.substring(0, 50)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    post.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.status}
                  </span>
                  {post.featured && (
                    <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {post.author?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.publishedAt ? formatDate(post.publishedAt) : 'Not published'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      onClickHandler={() => onView(post)}
                      additionalClasses="text-blue-600 hover:text-blue-900 text-xs"
                    >
                      View
                    </Button>
                    <Button
                      onClickHandler={() => onEdit(post)}
                      additionalClasses="text-indigo-600 hover:text-indigo-900 text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      onClickHandler={() => onDelete(post)}
                      additionalClasses="text-red-600 hover:text-red-900 text-xs"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClickHandler={() => setPageAndFetch(pagination.page - 1)}
              disabled={pagination.page === 1}
              additionalClasses="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </Button>
            <Button
              onClickHandler={() => setPageAndFetch(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              additionalClasses="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{pagination.page}</span> of{' '}
                <span className="font-medium">{pagination.totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button
                  onClickHandler={() => setPageAndFetch(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  additionalClasses="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </Button>
                <Button
                  onClickHandler={() => setPageAndFetch(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  additionalClasses="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsListView; 