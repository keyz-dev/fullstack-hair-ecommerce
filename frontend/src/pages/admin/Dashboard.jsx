import React from 'react';
import { Upcoming } from '../../components/ui';

const Dashboard = () => {
  return (
    <Upcoming 
      title="Admin Dashboard Coming Soon"
      description="Our comprehensive admin dashboard is being developed to provide powerful tools for managing your e-commerce platform."
      expectedDate="August 2025"
      features={[
        "Sales analytics",
        "Inventory management",
        "Customer insights",
        "Order processing"
      ]}
      colorTheme="blue"
    />
  );
};

export default Dashboard;