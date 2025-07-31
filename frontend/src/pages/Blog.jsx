import React from 'react';
import { Upcoming } from '../components/ui';

const Blog = () => {
  return (
    <Upcoming 
      title="Blog Coming Soon"
      description="Our blog section is currently under development. We're working hard to bring you engaging content, industry insights, and helpful tips."
      expectedDate="December 2024"
      features={[
        "Expert articles and insights",
        "Industry news and updates",
        "Tips and tutorials",
        "Community stories"
      ]}
      colorTheme="purple"
    />
  );
};

export default Blog;