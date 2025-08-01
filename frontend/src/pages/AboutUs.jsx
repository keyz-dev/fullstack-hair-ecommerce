import React from 'react';
import { Upcoming } from '../components/ui';

const AboutUs = () => {
  return (
    <Upcoming 
      title="About Us Coming Soon"
      description="We're crafting our story to share with you. Our about page will showcase our mission, values, and the team behind Braid Commerce."
      expectedDate="August 2025"
      features={[
        "Our mission and vision",
        "Team member profiles",
        "Company history",
        "Values and culture"
      ]}
      colorTheme="green"
    />
  );
};

export default AboutUs;