import React from 'react';
import { Upcoming } from '../../components/ui';

const Profile = () => {
  return (
    <Upcoming 
      title="Profile Management Coming Soon"
      description="Our profile management system is being developed to provide comprehensive tools for managing user profiles and preferences."
      expectedDate="January 2025"
      features={[
        "Profile customization",
        "Security settings",
        "Preferences management",
        "Account verification"
      ]}
      colorTheme="indigo"
    />
  );
};

export default Profile;