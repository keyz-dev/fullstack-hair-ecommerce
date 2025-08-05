export const getPostTypeConfig = (postType) => {
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

export const getMediaType = (post) => {
  // Add null safety checks
  if (!post) return 'text';
  
  if (post.video && post.video.url) return 'video';
  if (post.images && post.images.length > 0) return 'image';
  return 'text';
}; 