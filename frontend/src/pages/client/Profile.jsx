
import React from 'react';
import { Upcoming } from '../../components/ui';

const Profile = () => {
  return (
    <Upcoming 
      title="Profile Coming Soon"
      description="Our profile system is being developed to provide you with a seamless way to manage your profile."
      expectedDate="August 2025"
      features={[
        "Profile management",
        "Address management",
        "Order history",
        "Payment history"
      ]}
      colorTheme="teal"
    />
  );
};

export default Profile;