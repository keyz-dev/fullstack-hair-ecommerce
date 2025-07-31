import React from 'react';
import { Upcoming } from '../components/ui';

const Posts = () => {
  return (
    <Upcoming 
      title="Posts Coming Soon"
      description="Our posts section is being developed to share valuable content, updates, and insights with our community."
      expectedDate="December 2024"
      features={[
        "Latest updates",
        "Community posts",
        "Interactive content",
        "Social sharing"
      ]}
      colorTheme="pink"
    />
  );
};

export default Posts;