import React from 'react';
import { StatCard } from '../../ui';
import { FileText, Eye, Heart, MessageCircle } from 'lucide-react';

const PostStatSection = ({posts = [], featuredPosts = []}) => {
  const stats = [
    {
      title: 'Total Posts',
      value: posts.length,
      icon: FileText,
      colorTheme: 'blue'
    },
    {
      title: 'Featured Posts',
      value: featuredPosts.length,
      icon: FileText,
      colorTheme: 'yellow'
    },
    {
      title: 'Total Views',
      value: posts.reduce((sum, post) => sum + (post.views || 0), 0),
      icon: Eye,
      colorTheme: 'green'
    },
    {
      title: 'Total Likes',
      value: posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0),
      icon: Heart,
      colorTheme: 'red'
    },
    {
      title: 'Total Comments',
      value: posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0),
      icon: MessageCircle,
      colorTheme: 'purple'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          {...stat}
        />
      ))}
    </div>
  );
};

export default PostStatSection; 