import React, { useState } from 'react';
import { StatCard } from '../ui';
import { ShoppingBag, Clock, CheckCircle, DollarSign, MoreVertical, XCircle } from 'lucide-react';
import { DropdownMenu } from '../ui';

const OrderStats = ({ stats }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getFilteredStats = () => {
    if (activeFilter === 'all') {
      return stats;
    }
    
    // Filter stats based on selected filter
    const filteredStats = { ...stats };
    if (activeFilter === 'pending') {
      filteredStats.total = stats.pending;
      filteredStats.pending = stats.pending;
      filteredStats.processing = 0;
      filteredStats.delivered = 0;
      filteredStats.cancelled = 0;
      filteredStats.totalSpent = 0;
    } else if (activeFilter === 'processing') {
      filteredStats.total = stats.processing;
      filteredStats.pending = 0;
      filteredStats.processing = stats.processing;
      filteredStats.delivered = 0;
      filteredStats.cancelled = 0;
      filteredStats.totalSpent = 0;
    } else if (activeFilter === 'delivered') {
      filteredStats.total = stats.delivered;
      filteredStats.pending = 0;
      filteredStats.processing = 0;
      filteredStats.delivered = stats.delivered;
      filteredStats.cancelled = 0;
      filteredStats.totalSpent = stats.totalSpent;
    } else if (activeFilter === 'cancelled') {
      filteredStats.total = stats.cancelled;
      filteredStats.pending = 0;
      filteredStats.processing = 0;
      filteredStats.delivered = 0;
      filteredStats.cancelled = stats.cancelled;
      filteredStats.totalSpent = 0;
    }
    
    return filteredStats;
  };

  const filteredStats = getFilteredStats();

  const statCards = [
    {
      title: "Total Orders",
      value: filteredStats.total,
      colorTheme: "blue",
      icon: ShoppingBag,
      description: "Total number of orders",
    },
    {
      title: "Pending",
      value: filteredStats.pending,
      colorTheme: "purple",
      icon: Clock,
      description: "Orders awaiting processing",
    },
    {
      title: "Delivered",
      value: filteredStats.delivered,
      colorTheme: "green",
      icon: CheckCircle,
      description: "Orders delivered",
    },
    {
      title: "Cancelled",
      value: filteredStats.cancelled,
      colorTheme: "red",
      icon: XCircle,
      description: "Orders cancelled",
    }
  ];

  const filterOptions = [
    { label: "All Orders", value: "all" },
    { label: "Pending Only", value: "pending" },
    { label: "Processing Only", value: "processing" },
    { label: "Delivered Only", value: "delivered" },
    { label: "Cancelled Only", value: "cancelled" },
  ];

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const menuItems = [
    ...filterOptions.map(option => ({
      label: option.label,
      onClick: () => handleFilterChange(option.value),
      isActive: activeFilter === option.value,
    })),
  ];

  return (
    <div className="mb-6">
        
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} className="w-[180px] lg:w-[230px]" />
        ))}
      </div>
      
      {activeFilter !== 'all' && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Showing filtered results for: <span className="font-medium">{filterOptions.find(f => f.value === activeFilter)?.label}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderStats; 