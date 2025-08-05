
import React from 'react';
import { Upcoming, FadeInContainer } from '../../components/ui';

const Settings = () => {
  return (
    <FadeInContainer delay={200} duration={600}>
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
    </FadeInContainer>
  );
};

export default Settings;