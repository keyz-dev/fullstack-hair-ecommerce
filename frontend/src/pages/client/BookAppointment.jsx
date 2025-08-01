
import React from 'react';
import { Upcoming } from '../../components/ui';

const BookAppointment = () => {
  return (
    <Upcoming 
      title="Booking System Coming Soon"
      description="Our appointment booking system is being developed to provide you with a seamless way to schedule services and consultations."
      expectedDate="August 2025"
      features={[
        "Easy appointment scheduling",
        "Calendar integration",
        "Reminder notifications",
        "Booking management"
      ]}
      colorTheme="teal"
    />
  );
};

export default BookAppointment;