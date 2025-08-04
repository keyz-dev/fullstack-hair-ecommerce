import React from 'react';
import { UserInfo, ProfileStatCard } from '../../ui';
import { Calendar, Mail, Phone, MapPin, Shield, CheckCircle, XCircle, Package, Star, Clock } from 'lucide-react';

const ProfileOverview = ({ user, stats }) => {
  const imagePlaceholder = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProfileCompletionPercentage = () => {
    if (!user) return 0;
    
    const fields = [
      user.firstName,
      user.lastName,
      user.email,
      user.phone,
      user.dateOfBirth,
      user.gender,
      user.bio
    ];
    
    const completedFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const profileCompletion = getProfileCompletionPercentage();

  return (
    <div className="p-3 md:p-6 space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-gradient-to-r from-accent/5 to-accent/10 rounded-lg border border-accent/20">
        <div className="relative">
          <img
            src={user?.avatar || imagePlaceholder}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
            <CheckCircle size={16} className="text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-gray-600">{user?.email}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              Member since {formatDate(user?.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              {user?.emailVerified ? (
                <CheckCircle size={14} className="text-green-500" />
              ) : (
                <XCircle size={14} className="text-red-500" />
              )}
              {user?.emailVerified ? 'Email verified' : 'Email not verified'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Profile completeness</span>
            <span className="text-sm font-medium text-gray-900">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
          {profileCompletion < 100 && (
            <p className="text-xs text-gray-500">
              Complete your profile to unlock additional features
            </p>
          )}
        </div>
      </div>

      {/* User Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProfileStatCard
            title="Total Orders"
            value={stats.totalOrders || 0}
            icon={Package}
            colorTheme="blue"
            description="Orders placed"
          />
          <ProfileStatCard
            title="Reviews"
            value={stats.totalReviews || 0}
            icon={Star}
            colorTheme="yellow"
            description="Product reviews"
          />
          <ProfileStatCard
            title="Member Since"
            value={formatDate(stats.memberSince)}
            icon={Clock}
            colorTheme="green"
            description="Account created"
          />
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-gray-900 mt-1">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <div className="flex items-center gap-2 mt-1">
                <Mail size={16} className="text-gray-400" />
                <p className="text-gray-900">{user?.email}</p>
                {user?.emailVerified && (
                  <CheckCircle size={16} className="text-green-500" />
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Phone</label>
              <div className="flex items-center gap-2 mt-1">
                <Phone size={16} className="text-gray-400" />
                <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
              <p className="text-gray-900 mt-1">
                {formatDate(user?.dateOfBirth)}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Gender</label>
              <p className="text-gray-900 mt-1 capitalize">
                {user?.gender || 'Not specified'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Bio</label>
              <p className="text-gray-900 mt-1">
                {user?.bio || 'No bio provided'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Shield size={20} className="text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Account Status</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar size={20} className="text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Last Login</p>
              <p className="text-xs text-gray-500">
                {formatDate(stats?.lastLogin)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview; 