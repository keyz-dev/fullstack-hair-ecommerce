import React from 'react';
import { Upcoming } from '../../components/ui';

const Users = () => {
  return (
    <Upcoming 
      title="User Management Coming Soon"
      description="Our user management system is being developed to provide comprehensive tools for managing customer accounts and permissions."
      expectedDate="January 2025"
      features={[
        "User profiles",
        "Role management",
        "Account settings",
        "Activity tracking"
      ]}
      colorTheme="green"
    />
  );
};

export default Users;