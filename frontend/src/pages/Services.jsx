import React from 'react';
import { Upcoming, HeroSection } from '../components/ui';
import servicesHeroBg from '../assets/images/services_bg.jpg';

const Services = () => {
  return (

    <>
    {/* Hero Section */}
    <HeroSection
        title="Services"
        subtitle="Services Coming Soon"
        breadcrumbs={['Home', 'Services']}
        backgroundImage={servicesHeroBg}
      >
        {/* Optional: Add hero content like featured categories or promotional text */}
        <div className="mt-8">
          <p className="text-white/80 text-sm">
            Services Coming Soon
          </p>
        </div>
      </HeroSection>
      
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
    </>
  );
};

export default Services;