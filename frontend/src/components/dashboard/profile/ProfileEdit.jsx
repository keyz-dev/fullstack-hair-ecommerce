import React, { useState, useEffect } from 'react';
import { useProfile } from '../../../hooks';
import { Input, TextArea, Button, FileUploader } from '../../ui';
import { Camera, Save, X } from 'lucide-react';

const ProfileEdit = () => {
  const { user, updateProfile, updateAvatar, deleteAvatar, loading } = useProfile();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bio: ''
  });
  const [errors, setErrors] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        bio: user.bio || ''
      });
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAvatarChange = (file) => {
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Update profile data
      await updateProfile(formData);
      
      // Update avatar if changed
      if (avatarFile) {
        await updateAvatar(avatarFile);
      }
      
      // Reset form state
      setAvatarFile(null);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleRemoveAvatarClick = async () => {
    try {
      await deleteAvatar();
      handleRemoveAvatar();
    } catch (error) {
      console.error('Failed to remove avatar:', error);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={avatarPreview || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full border-4 border-white flex items-center justify-center cursor-pointer hover:bg-accent/90 transition-colors">
                <Camera size={16} className="text-white" />
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <FileUploader
                preview={avatarPreview}
                onChange={handleAvatarChange}
                className="w-[35%]"
                text="Upload New Photo"
              />
              
              {avatarPreview && (
                <Button
                  type="button"
                  onClickHandler={handleRemoveAvatarClick}
                  additionalClasses="bg-red-500 text-white hover:bg-red-600"
                >
                  <X size={16} />
                  Remove Photo
                </Button>
              )}
              
              <p className="text-xs text-gray-500">
                JPG, PNG or GIF. Max size 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChangeHandler={handleInputChange}
              error={errors.firstName}
              required
            />
            
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChangeHandler={handleInputChange}
              error={errors.lastName}
              required
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChangeHandler={handleInputChange}
              error={errors.email}
              required
            />
            
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChangeHandler={handleInputChange}
              error={errors.phone}
              placeholder="+1234567890"
            />
            
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChangeHandler={handleInputChange}
              error={errors.dateOfBirth}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <TextArea
              label="Bio"
              name="bio"
              value={formData.bio}
              onChangeHandler={handleInputChange}
              placeholder="Tell us a bit about yourself..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.bio.length}/500 characters
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={loading}
            additionalClasses="bg-accent text-white hover:bg-accent/90"
          >
            <Save size={16} />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit; 