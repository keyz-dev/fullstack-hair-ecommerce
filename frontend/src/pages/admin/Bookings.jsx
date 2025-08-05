import React from 'react';
import { Upcoming, FadeInContainer } from '../../components/ui';

const Bookings = () => {
  return (
    <FadeInContainer delay={200} duration={600}>
      <Upcoming 
        title="Booking Management Coming Soon"
        description="Our booking management system is being developed to provide comprehensive tools for managing appointments and reservations."
        expectedDate="August 2025"
        features={[
          "Appointment scheduling",
          "Calendar management",
          "Customer notifications",
          "Booking analytics"
        ]}
        colorTheme="teal"
      />
    </FadeInContainer>
  );
};

export default Bookings;