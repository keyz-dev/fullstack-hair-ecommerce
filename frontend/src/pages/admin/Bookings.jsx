import React from 'react';
import { Upcoming } from '../../components/ui';

const Bookings = () => {
  return (
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
  );
};

export default Bookings;