import React from 'react';
import { Upcoming, FadeInContainer } from '../../components/ui';

const Users = () => {
  return (
    <FadeInContainer delay={200} duration={600}>
      <Upcoming 
        title="User Management Coming Soon"
        description="Our user management system is being developed to provide comprehensive tools for managing customer accounts and permissions."
        expectedDate="August 2025"
        features={[
          "User profiles",
          "Role management",
          "Account settings",
          "Activity tracking"
        ]}
        colorTheme="green"
      />
    </FadeInContainer>
  );
};

export default Users;