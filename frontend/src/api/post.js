import api from './index';

const URL_PREFIX = "/post";

export const postApi = {
  // Get all posts with filtering and pagination (admin only)
  getAllPosts: async (params = {}) => {
    const response = await api.get(`${URL_PREFIX}/`, { params });
    return response.data;
  },

  // Get published posts only (public access)
  getPublishedPosts: async (params = {}) => {
    const response = await api.get(`${URL_PREFIX}/published`, { params });
    return response.data;
  },

  // Get single post by ID
  getPostById: async (postId, userId = null) => {
    const params = userId ? { userId } : {};
    const response = await api.get(`${URL_PREFIX}/${postId}`, { params });
    return response.data;
  },

  // Get featured posts
  getFeaturedPosts: async (limit = 6) => {
    const response = await api.get(`${URL_PREFIX}/featured`, { params: { limit } });
    return response.data;
  },

  // Get posts by category
  getPostsByCategory: async (categoryId, params = {}) => {
    const response = await api.get(`${URL_PREFIX}/category/${categoryId}`, { params });
    return response.data;
  },

  // Create new post
  createPost: async (postData) => {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(postData).forEach(key => {
      if (key !== 'postImages' && key !== 'postVideo' && key !== 'thumbnail' && 
          key !== 'imageCaptions' && key !== 'videoCaption' && key !== 'imageOrder') {
        if (Array.isArray(postData[key])) {
          postData[key].forEach(item => {
            formData.append(key, item);
          });
        } else if (typeof postData[key] === 'object') {
          formData.append(key, JSON.stringify(postData[key]));
        } else {
          formData.append(key, postData[key]);
        }
      }
    });

    // Add images for image posts
    if (postData.mediaType === 'images' && postData.postImages) {
      Array.from(postData.postImages).forEach((image, index) => {
        formData.append('postImages', image);
        if (postData.imageCaptions?.[index]) {
          formData.append('imageCaptions', postData.imageCaptions[index]);
        }
        if (postData.imageOrder?.[index] !== undefined) {
          formData.append('imageOrder', postData.imageOrder[index]);
        }
      });
    }

    // Add video for video posts
    if (postData.mediaType === 'video' && postData.postVideo) {
      formData.append('postVideo', postData.postVideo);
      if (postData.videoCaption) {
        formData.append('videoCaption', postData.videoCaption);
      }
      
      // Add thumbnail if provided
      if (postData.thumbnail) {
        formData.append('thumbnail', postData.thumbnail);
      }
    }

    const response = await api.post(`${URL_PREFIX}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update post
  updatePost: async (id, postData) => {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(postData).forEach(key => {
      if (key !== 'postImages' && key !== 'postVideo' && key !== 'thumbnail' && 
          key !== 'imageCaptions' && key !== 'videoCaption' && key !== 'imageOrder') {
        if (Array.isArray(postData[key])) {
          postData[key].forEach(item => {
            formData.append(key, item);
          });
        } else if (typeof postData[key] === 'object') {
          formData.append(key, JSON.stringify(postData[key]));
        } else {
          formData.append(key, postData[key]);
        }
      }
    });

    // Add images for image posts
    if (postData.mediaType === 'images' && postData.postImages) {
      Array.from(postData.postImages).forEach((image, index) => {
        formData.append('postImages', image);
        if (postData.imageCaptions?.[index]) {
          formData.append('imageCaptions', postData.imageCaptions[index]);
        }
        if (postData.imageOrder?.[index] !== undefined) {
          formData.append('imageOrder', postData.imageOrder[index]);
        }
      });
    }

    // Add video for video posts
    if (postData.mediaType === 'video' && postData.postVideo) {
      formData.append('postVideo', postData.postVideo);
      if (postData.videoCaption) {
        formData.append('videoCaption', postData.videoCaption);
      }
      
      // Add thumbnail if provided
      if (postData.thumbnail) {
        formData.append('thumbnail', postData.thumbnail);
      }
    }

    const response = await api.put(`${URL_PREFIX}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete post
  deletePost: async (id) => {
    const response = await api.delete(`${URL_PREFIX}/${id}`);
    return response.data;
  },

  // Like/Unlike post
  toggleLike: async (id) => {
    const response = await api.post(`${URL_PREFIX}/${id}/like`);
    return response.data;
  },

  // Add comment (deprecated - use comment routes instead)
  addComment: async (id, commentData) => {
    const response = await api.post(`/comments/post/${id}`, commentData);
    return response.data;
  },

  // Get post analytics
  getPostAnalytics: async (id) => {
    const response = await api.get(`${URL_PREFIX}/${id}/analytics`);
    return response.data;
  },

  // Get all post stats
  getPostStats: async () => {
    const response = await api.get(`${URL_PREFIX}/admin/stats`);
    return response.data;
  },
}; 