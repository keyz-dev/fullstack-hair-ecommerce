import React, { useState, useEffect } from 'react';
import { useProfile } from '../../../hooks';
import { TabGroup, FadeInContainer } from '../../ui';
import ProfileOverview from './ProfileOverview';
import ProfileEdit from './ProfileEdit';
import SecuritySettings from './SecuritySettings';
import PreferencesSettings from './PreferencesSettings';
import ProfileStats from './ProfileStats';

const ProfilePage = () => {
  const { user, getUserStats, loading } = useProfile();
  const [userStats, setUserStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const stats = await getUserStats();
        setUserStats(stats);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    };

    fetchUserStats();
  }, [getUserStats]);

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: '👤',
      component: <ProfileOverview user={user} stats={userStats} />
    },
    {
      id: 'edit',
      label: 'Edit Profile',
      icon: '✏️',
      component: <ProfileEdit />
    },
    {
      id: 'security',
      label: 'Security',
      icon: '🔒',
      component: <SecuritySettings />
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: '⚙️',
      component: <PreferencesSettings />
    },
    {
      id: 'stats',
      label: 'Activity',
      icon: '📊',
      component: <ProfileStats stats={userStats} />
    }
  ];

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <FadeInContainer delay={200} duration={600}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </FadeInContainer>

      <FadeInContainer delay={400} duration={600}>
        <TabGroup
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        />
      </FadeInContainer>
    </div>
  );
};

export default ProfilePage; 