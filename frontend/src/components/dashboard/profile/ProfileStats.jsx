import React from 'react';
import { ProfileStatCard } from '../../ui';
import { Calendar, TrendingUp, Package, Star, Clock, Activity, CheckCircle, XCircle, Mail } from 'lucide-react';

const ProfileStats = ({ stats }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Not available';
    
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const getActivityLevel = (lastLogin) => {
    if (!lastLogin) return { level: 'Inactive', color: 'gray', icon: '🔴' };
    
    const now = new Date();
    const lastLoginDate = new Date(lastLogin);
    const diffInDays = Math.floor((now - lastLoginDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 1) return { level: 'Very Active', color: 'green', icon: '🟢' };
    if (diffInDays <= 7) return { level: 'Active', color: 'blue', icon: '🔵' };
    if (diffInDays <= 30) return { level: 'Moderate', color: 'yellow', icon: '🟡' };
    return { level: 'Inactive', color: 'red', icon: '🔴' };
  };

  const activityLevel = getActivityLevel(stats?.lastLogin);

  return (
    <div className="p-3 md:p-6 space-y-6">
      {/* Activity Overview */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Activity Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Member Since</p>
              <p className="text-xs text-gray-500">{formatDate(stats?.memberSince)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Last Login</p>
              <p className="text-xs text-gray-500">{formatTimeAgo(stats?.lastLogin)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingUp size={16} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Activity Level</p>
              <p className="text-xs text-gray-500">{activityLevel.level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProfileStatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={Package}
          colorTheme="blue"
          description="Orders placed"
        />
        <ProfileStatCard
          title="Reviews Given"
          value={stats?.totalReviews || 0}
          icon={Star}
          colorTheme="yellow"
          description="Product reviews"
        />
        <ProfileStatCard
          title="Profile Complete"
          value={stats?.profileComplete ? '100%' : 'Incomplete'}
          icon={CheckCircle}
          colorTheme={stats?.profileComplete ? 'green' : 'orange'}
          description="Profile status"
        />
        <ProfileStatCard
          title="Email Verified"
          value={stats?.emailVerified ? 'Yes' : 'No'}
          icon={Mail}
          colorTheme={stats?.emailVerified ? 'green' : 'red'}
          description="Email status"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Package size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Order Placed</p>
              <p className="text-sm text-gray-500">You placed an order for hair products</p>
              <p className="text-xs text-gray-400">{formatTimeAgo(stats?.lastLogin)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Star size={20} className="text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Review Submitted</p>
              <p className="text-sm text-gray-500">You reviewed a product</p>
              <p className="text-xs text-gray-400">2 days ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar size={20} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Profile Updated</p>
              <p className="text-sm text-gray-500">You updated your profile information</p>
              <p className="text-xs text-gray-400">1 week ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Health */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Health</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full bg-${activityLevel.color}-500`}></div>
              <div>
                <p className="font-medium text-gray-900">Account Status</p>
                <p className="text-sm text-gray-500">{activityLevel.level}</p>
              </div>
            </div>
            <span className="text-2xl">{activityLevel.icon}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full bg-${stats?.emailVerified ? 'green' : 'red'}-500`}></div>
              <div>
                <p className="font-medium text-gray-900">Email Verification</p>
                <p className="text-sm text-gray-500">
                  {stats?.emailVerified ? 'Email is verified' : 'Email not verified'}
                </p>
              </div>
            </div>
            <span className="text-2xl">{stats?.emailVerified ? '✅' : '❌'}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full bg-${stats?.profileComplete ? 'green' : 'orange'}-500`}></div>
              <div>
                <p className="font-medium text-gray-900">Profile Completion</p>
                <p className="text-sm text-gray-500">
                  {stats?.profileComplete ? 'Profile is complete' : 'Profile needs completion'}
                </p>
              </div>
            </div>
            <span className="text-2xl">{stats?.profileComplete ? '✅' : '⚠️'}</span>
          </div>
        </div>
      </div>

      {/* Tips for Better Experience */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Better Experience</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700">
              Complete your profile to unlock additional features and personalized recommendations.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700">
              Verify your email address to receive important updates and order confirmations.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700">
              Leave reviews for products you've purchased to help other customers.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700">
              Check your order history regularly to track your purchases and delivery status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats; 