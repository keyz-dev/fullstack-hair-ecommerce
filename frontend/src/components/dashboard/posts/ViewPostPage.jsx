import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Share2 } from 'lucide-react';
import { Button, LoadingSpinner } from '../../ui';
import { usePost } from '../../../hooks/usePost';
import { toast } from 'react-toastify';

const ViewPostPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { fetchPostById } = usePost();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postData = await fetchPostById(postId);
        if (postData) {
          setPost(postData);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load post data');
        navigate('/admin/posts');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, fetchPostById, navigate]);

  const handleEdit = () => {
    navigate(`/admin/posts/${postId}/edit`);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/blog/${post.slug}`;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description || post.content?.substring(0, 100),
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
          <p className="text-gray-600 mb-6">The post you're looking for doesn't exist.</p>
          <Button
            onClickHandler={() => navigate('/admin/posts')}
            text="Back to Posts"
            additionalClasses="bg-accent hover:bg-accent/90 text-white"
          />
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                onClickHandler={() => navigate('/admin/posts')}
                additionalClasses="mr-4 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">View Post</h1>
                <p className="text-sm text-gray-500">Post details and preview</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClickHandler={handleShare}
                additionalClasses="text-gray-600 border-gray-300 hover:bg-gray-50"
                leadingIcon={<Share2 size={16} />}
              >
                Share
              </Button>
              <Button
                onClickHandler={handleEdit}
                additionalClasses="bg-accent hover:bg-accent/90 text-white"
                leadingIcon={<Edit size={16} />}
              >
                Edit Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Post Header */}
          <div className="p-6 border-b border-gray-200">
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
                        <div className="text-red-500 text-2xl">🎥</div>
                      )}
                    </div>
                  ) : mediaType === 'image' ? (
                    <img
                      src={post.images[0].url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-gray-500 text-2xl">📝</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-3">
                  {post.description || post.content?.substring(0, 200) || 'No description available...'}
                </p>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
                    <span className="mr-1">{typeConfig.icon}</span>
                    {typeConfig.label}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                    {post.featured && <span className="mr-1">⭐</span>}
                    {statusConfig.text}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {mediaType === 'video' ? '🎥 Video' : mediaType === 'image' ? '🖼️ Images' : '📝 Text'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-gray-200">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{post.views || 0}</div>
              <div className="text-xs text-blue-500">Views</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{post.likes?.length || 0}</div>
              <div className="text-xs text-red-500">Likes</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{post.comments?.length || 0}</div>
              <div className="text-xs text-green-500">Comments</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {post.featured ? '⭐' : '—'}
              </div>
              <div className="text-xs text-purple-500">Featured</div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">
                    {post.author?.name || 'Unknown'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Published Date</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-900">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not published'}
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
                        #{tag}
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
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 border-t border-gray-200">
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
            <div className="p-6 border-t border-gray-200">
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
                      <div className="text-red-500 text-2xl">🎥</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPostPage; 