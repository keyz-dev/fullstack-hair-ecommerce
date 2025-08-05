import React from 'react';
import { Upcoming, FadeInContainer } from '../../components/ui';

const Notifications = () => {
  return (
    <FadeInContainer delay={200} duration={600}>
      <Upcoming 
        title="Notification System Coming Soon"
        description="Our notification system is being developed to provide comprehensive tools for managing and sending notifications to users."
        expectedDate="August 2025"
        features={[
          "Push notifications",
          "Email notifications",
          "SMS alerts",
          "Notification preferences"
        ]}
        colorTheme="red"
      />
    </FadeInContainer>
  );
};

export default Notifications;