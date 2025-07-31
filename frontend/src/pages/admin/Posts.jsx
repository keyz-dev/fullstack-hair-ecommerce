import React from 'react';
import { Upcoming } from '../../components/ui';

const Posts = () => {
  return (
    <Upcoming 
      title="Post Management Coming Soon"
      description="Our post management system is being developed to provide tools for creating and managing various types of content."
      expectedDate="December 2024"
      features={[
        "Content creation",
        "Media management",
        "Publishing tools",
        "Content analytics"
      ]}
      colorTheme="pink"
    />
  );
};

export default Posts;