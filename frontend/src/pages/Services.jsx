import React from 'react';
import { Upcoming } from '../components/ui';

const Services = () => {
  return (
    <Upcoming 
      title="Services Coming Soon"
      description="Our comprehensive services page is being developed to showcase all the amazing services we offer to our valued customers."
      expectedDate="December 2024"
      features={[
        "Service catalog",
        "Pricing information",
        "Service booking",
        "Customer testimonials"
      ]}
      colorTheme="orange"
    />
  );
};

export default Services;