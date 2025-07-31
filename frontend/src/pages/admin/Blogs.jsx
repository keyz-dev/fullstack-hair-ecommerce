import React from 'react';
import { Upcoming } from '../../components/ui';

const Blogs = () => {
  return (
    <Upcoming 
      title="Blog Management Coming Soon"
      description="Our blog management system is being developed to provide tools for creating, editing, and managing blog content."
      expectedDate="December 2024"
      features={[
        "Content creation",
        "Editor tools",
        "Publishing workflow",
        "SEO optimization"
      ]}
      colorTheme="purple"
    />
  );
};

export default Blogs;