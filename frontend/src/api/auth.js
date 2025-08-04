import api from ".";

export const authApi = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
  register: async (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      if (key === "avatar" && userData[key]) {
        formData.append("avatar", userData[key]);
      } else {
        formData.append(key, userData[key]);
      }
    });
    const response = await api.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  verifyToken: async () => {
    const response = await api.get("/auth/verify-token");
    return response.data;
  },
  verifyEmail: async (email, code, origin) => {
    const response = await api.post("/auth/verify-email", { email, code, origin });
    return response.data;
  },
  resendVerification: async (email) => {
    const response = await api.post("/auth/resend-verification", { email });
    return response.data;
  },
  googleOAuth: async (access_token) => {
    const response = await api.post("/auth/google-oauth", { access_token });
    return response.data;
  },
};

// Profile management API
export const profileApi = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get("/user/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put("/user/profile", profileData);
    return response.data;
  },

  // Update user password
  updatePassword: async (passwordData) => {
    const response = await api.put("/user/password", passwordData);
    return response.data;
  },

  // Update user avatar
  updateAvatar: async (avatarFile) => {
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    
    const response = await api.put("/user/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete user avatar
  deleteAvatar: async () => {
    const response = await api.delete("/user/avatar");
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get("/user/stats");
    return response.data;
  },

  // Update user preferences
  updatePreferences: async (preferences) => {
    const response = await api.put("/user/preferences", { preferences });
    return response.data;
  },
}; 