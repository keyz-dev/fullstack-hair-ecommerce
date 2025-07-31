import React from 'react';
import { Upcoming, HeroSection } from '../components/ui';
import blogHeroBg from '../assets/images/blog_bg.jpg';

const Blog = () => {
  return (
    <>
    {/* Hero Section */}
    <HeroSection
        title="Blog"
        subtitle="Blog Coming Soon"
        breadcrumbs={['Home', 'Blog']}
        backgroundImage={blogHeroBg}
      >
        {/* Optional: Add hero content like featured categories or promotional text */}
        <div className="mt-8">
          <p className="text-white/80 text-sm">
            Blog Coming Soon
          </p>
        </div>
      </HeroSection>

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
    </>
  );
};

export default Blog;