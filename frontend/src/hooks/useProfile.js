import { useState, useCallback } from 'react';
import { profileApi } from '../api/auth';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';

export const useProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user profile
  const getProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await profileApi.getProfile();
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch profile';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await profileApi.updateProfile(profileData);
      if (response.success) {
        // Update the user in auth context
        updateUser(response.data);
        toast.success('Profile updated successfully');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  // Update user password
  const updatePassword = useCallback(async (passwordData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await profileApi.updatePassword(passwordData);
      if (response.success) {
        toast.success('Password updated successfully');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update password');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update password';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user avatar
  const updateAvatar = useCallback(async (avatarFile) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await profileApi.updateAvatar(avatarFile);
      if (response.success) {
        // Update the user avatar in auth context
        updateUser({ ...user, avatar: response.data.avatar });
        toast.success('Avatar updated successfully');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update avatar');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update avatar';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, updateUser]);

  // Delete user avatar
  const deleteAvatar = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await profileApi.deleteAvatar();
      if (response.success) {
        // Remove avatar from user in auth context
        updateUser({ ...user, avatar: null });
        toast.success('Avatar removed successfully');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to remove avatar');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to remove avatar';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, updateUser]);

  // Get user statistics
  const getUserStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await profileApi.getUserStats();
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch user stats');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch user stats';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user preferences
  const updatePreferences = useCallback(async (preferences) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await profileApi.updatePreferences(preferences);
      if (response.success) {
        // Update user preferences in auth context
        updateUser({ ...user, preferences: response.data.preferences });
        toast.success('Preferences updated successfully');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update preferences');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update preferences';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, updateUser]);

  return {
    user,
    loading,
    error,
    getProfile,
    updateProfile,
    updatePassword,
    updateAvatar,
    deleteAvatar,
    getUserStats,
    updatePreferences,
  };
}; 