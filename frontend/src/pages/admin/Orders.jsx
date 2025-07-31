import React from 'react';
import { Upcoming } from '../../components/ui';

const Orders = () => {
  return (
    <Upcoming 
      title="Order Management Coming Soon"
      description="Our order management system is being developed to provide comprehensive tools for processing and tracking customer orders."
      expectedDate="January 2025"
      features={[
        "Order processing",
        "Status updates",
        "Shipping management",
        "Returns handling"
      ]}
      colorTheme="orange"
    />
  );
};

export default Orders;