import React from 'react';
import { StatRenderer } from '../../ui';
import { FileText, Eye, Heart, MessageCircle } from 'lucide-react';

const PostStatSection = ({ stats, loading = false }) => {
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
    <StatRenderer statCards={statCards} className="lg:w-[230px]" isLoading={loading} />
  );
};

export default PostStatSection;