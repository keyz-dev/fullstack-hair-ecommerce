import React from 'react';
import { StatRenderer } from '../ui';
import { ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react';

const OrderStats = ({ stats, loading = false }) => {
  const statCards = [
    {
      title: "Total Orders",
      value: stats?.total ?? (loading ? "..." : 0),
      colorTheme: "blue",
      icon: ShoppingBag,
      description: "Total number of orders",
    },
    {
      title: "Pending",
      value: stats?.pending ?? (loading ? "..." : 0),
      colorTheme: "purple",
      icon: Clock,
      description: "Orders awaiting processing",
    },
    {
      title: "Delivered",
      value: stats?.delivered ?? (loading ? "..." : 0),
      colorTheme: "green",
      icon: CheckCircle,
      description: "Orders delivered",
    },
    {
      title: "Cancelled",
      value: stats?.cancelled ?? (loading ? "..." : 0),
      colorTheme: "red",
      icon: XCircle,
      description: "Orders cancelled",
    }
  ];

  return (
    <StatRenderer statCards={statCards} className="lg:w-[230px]" isLoading={loading} />
  );
};

export default OrderStats; 