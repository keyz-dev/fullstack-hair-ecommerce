import React from 'react';
import { StatRenderer } from '../ui';
import { ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react';

const OrderStats = ({ stats }) => {
  const statCards = [
    {
      title: "Total Orders",
      value: stats.total,
      colorTheme: "blue",
      icon: ShoppingBag,
      description: "Total number of orders",
    },
    {
      title: "Pending",
      value: stats.pending,
      colorTheme: "purple",
      icon: Clock,
      description: "Orders awaiting processing",
    },
    {
      title: "Delivered",
      value: stats.delivered,
      colorTheme: "green",
      icon: CheckCircle,
      description: "Orders delivered",
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      colorTheme: "red",
      icon: XCircle,
      description: "Orders cancelled",
    }
  ];

  return (
    <StatRenderer statCards={statCards} className="lg:w-[230px]" />
  );
};

export default OrderStats; 