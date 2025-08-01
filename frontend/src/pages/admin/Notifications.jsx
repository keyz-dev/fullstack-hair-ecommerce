import React from 'react';
import { Upcoming } from '../../components/ui';

const Notifications = () => {
  return (
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
  );
};

export default Notifications;