import React, { useEffect } from 'react';
import { StatCard } from '../../ui';
import { useService } from '../../../hooks';

const ServiceStatSection = () => {
  const { stats, fetchStats } = useService();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      title: 'Total Services',
      value: stats.total || 0,
      icon: 'Briefcase',
      color: 'blue',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Active Services',
      value: stats.active || 0,
      icon: 'CheckCircle',
      color: 'green',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Inactive Services',
      value: stats.inactive || 0,
      icon: 'XCircle',
      color: 'red',
      change: '-3%',
      changeType: 'negative',
    },
    {
      title: 'Featured Services',
      value: stats.featured || 0,
      icon: 'Star',
      color: 'yellow',
      change: '+15%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default ServiceStatSection; 