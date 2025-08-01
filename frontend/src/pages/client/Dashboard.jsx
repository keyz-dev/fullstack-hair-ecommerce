import React from 'react';
import { Upcoming } from '../../components/ui';

const Dashboard = () => {
  return (
    <Upcoming 
      title="Customer Dashboard Coming Soon"
      description="Our customer dashboard is being developed to provide you with a comprehensive view of your orders, preferences, and account information."
      expectedDate="August 2025"
      features={[
        "Order history",
        "Account settings",
        "Wishlist management",
        "Personal recommendations"
      ]}
      colorTheme="blue"
    />
  );
};

export default Dashboard;
