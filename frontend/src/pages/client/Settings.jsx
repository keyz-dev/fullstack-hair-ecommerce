
import React from 'react';
import { Upcoming } from '../../components/ui';

const Settings = () => {
  return (
    <Upcoming 
      title="Settings Coming Soon"
      description="Our settings system is being developed to provide you with a seamless way to manage your settings."
      expectedDate="August 2025"
      features={[
        "Settings management",
        "Profile management",
        "Address management",
        "Order history",
        "Payment history"
      ]}
      colorTheme="teal"
    />
  );
};

export default Settings;