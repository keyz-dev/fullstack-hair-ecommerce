import React from 'react';
import { Upcoming } from '../components/ui';

const Orders = () => {
  return (
    <Upcoming 
      title="Orders Coming Soon"
      description="Our orders management system is being developed to provide you with comprehensive order tracking and management capabilities."
      expectedDate="January 2025"
      features={[
        "Order history",
        "Order tracking",
        "Order status updates",
        "Invoice generation"
      ]}
      colorTheme="indigo"
    />
  );
};

export default Orders;