import api from './index';

const URL_PREFIX = "/post";

export const postApi = {
  // Get all posts with filtering and pagination
  getAllPosts: async (params = {}) => {
    const response = await api.get(`${URL_PREFIX}/`, { params });
    return response.data;
  },

  // Get single post by slug
  getPostBySlug: async (slug, userId = null) => {
    const params = userId ? { userId } : {};
    const response = await api.get(`${URL_PREFIX}/${slug}`, { params });
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
      if (key !== 'images' && key !== 'videos' && key !== 'imageAlts' && key !== 'imageCaptions' && key !== 'videoCaptions') {
        if (Array.isArray(postData[key])) {
          postData[key].forEach(item => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, postData[key]);
        }
      }
    });

    // Add images
    if (postData.images) {
      Array.from(postData.images).forEach((image, index) => {
        formData.append('images', image);
        if (postData.imageAlts?.[index]) {
          formData.append(`imageAlts[${index}]`, postData.imageAlts[index]);
        }
        if (postData.imageCaptions?.[index]) {
          formData.append(`imageCaptions[${index}]`, postData.imageCaptions[index]);
        }
      });
    }

    // Add videos
    if (postData.videos) {
      Array.from(postData.videos).forEach((video, index) => {
        formData.append('videos', video);
        if (postData.videoCaptions?.[index]) {
          formData.append(`videoCaptions[${index}]`, postData.videoCaptions[index]);
        }
      });
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
      if (key !== 'images' && key !== 'videos' && key !== 'imageAlts' && key !== 'imageCaptions' && key !== 'videoCaptions') {
        if (Array.isArray(postData[key])) {
          postData[key].forEach(item => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, postData[key]);
        }
      }
    });

    // Add images
    if (postData.images) {
      Array.from(postData.images).forEach((image, index) => {
        formData.append('images', image);
        if (postData.imageAlts?.[index]) {
          formData.append(`imageAlts[${index}]`, postData.imageAlts[index]);
        }
        if (postData.imageCaptions?.[index]) {
          formData.append(`imageCaptions[${index}]`, postData.imageCaptions[index]);
        }
      });
    }

    // Add videos
    if (postData.videos) {
      Array.from(postData.videos).forEach((video, index) => {
        formData.append('videos', video);
        if (postData.videoCaptions?.[index]) {
          formData.append(`videoCaptions[${index}]`, postData.videoCaptions[index]);
        }
      });
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

  // Add comment
  addComment: async (id, commentData) => {
    const response = await api.post(`${URL_PREFIX}/${id}/comment`, commentData);
    return response.data;
  },

  // Get post analytics
  getPostAnalytics: async (id) => {
    const response = await api.get(`${URL_PREFIX}/${id}/analytics`);
    return response.data;
  },
}; 