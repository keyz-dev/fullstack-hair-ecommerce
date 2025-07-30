import React from 'react';
import { ServiceProvider } from '../../contexts/ServiceContext';
import { ServicesMainView } from '../../components/dashboard/services';

const Services = () => {
  return (
    <ServiceProvider>
      <ServicesMainView />
    </ServiceProvider>
  );
};

export default Services;