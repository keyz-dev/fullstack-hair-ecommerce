import React, { useState } from 'react';
import { useProfile } from '../../../hooks';
import { Input, Button } from '../../ui';
import { Lock, Eye, EyeOff, Shield, Key } from 'lucide-react';

const SecuritySettings = () => {
  const { updatePassword, loading } = useProfile();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

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

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = 'Current password is required';
    }
    
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
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
      await updatePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      
      // Reset form
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to update password:', error);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['red', 'orange', 'yellow', 'lightgreen', 'green'];
    
    return {
      score: Math.min(score, 4),
      label: labels[Math.min(score, 4)],
      color: colors[Math.min(score, 4)]
    };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="p-3 md:p-6 space-y-6">
      {/* Security Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Security Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Lock size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Account Status</p>
              <p className="text-xs text-gray-500">Secure</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Key size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Last Password Change</p>
              <p className="text-xs text-gray-500">30 days ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Shield size={16} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Two-Factor Auth</p>
              <p className="text-xs text-gray-500">Not enabled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              label="Current Password"
              name="oldPassword"
              type={showPasswords.oldPassword ? 'text' : 'password'}
              value={formData.oldPassword}
              onChangeHandler={handleInputChange}
              error={errors.oldPassword}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('oldPassword')}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.oldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          
          <div className="relative">
            <Input
              label="New Password"
              name="newPassword"
              type={showPasswords.newPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChangeHandler={handleInputChange}
              error={errors.newPassword}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('newPassword')}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.newPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Password strength:</span>
                <span className={`text-xs font-medium text-${passwordStrength.color}-600`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 bg-${passwordStrength.color}-500`}
                  style={{ width: `${(passwordStrength.score + 1) * 20}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="relative">
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type={showPasswords.confirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChangeHandler={handleInputChange}
              error={errors.confirmPassword}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirmPassword')}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              isLoading={loading}
              additionalClasses="bg-accent text-white hover:bg-accent/90"
            >
              <Lock size={16} />
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* Security Tips */}
      <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700">
              Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700">
              Never share your password with anyone, including customer support.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700">
              Consider enabling two-factor authentication for additional security.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700">
              Change your password regularly and use different passwords for different accounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings; 