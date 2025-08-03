import React from 'react';
import { StatCard } from '../../ui';
import { FileText, Eye, Heart, MessageCircle } from 'lucide-react';

const PostStatSection = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Posts',
      value: stats?.total || 0,
      icon: FileText,
      colorTheme: 'blue'
    },
    {
      title: 'Featured Posts',
      value: stats?.featured || 0,
      icon: FileText,
      colorTheme: 'yellow'
    },
    {
      title: 'Total Views',
      value: stats?.totalViews || 0,
      icon: Eye,
      colorTheme: 'green'
    },
    {
      title: 'Total Likes',
      value: stats?.totalLikes || 0,
      icon: Heart,
      colorTheme: 'red'
    },
    {
      title: 'Total Comments',
      value: stats?.totalComments || 0,
      icon: MessageCircle,
      colorTheme: 'purple'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <StatCard
          key={index}
          {...stat}
        />
      ))}
    </div>
  );
};

export default PostStatSection;