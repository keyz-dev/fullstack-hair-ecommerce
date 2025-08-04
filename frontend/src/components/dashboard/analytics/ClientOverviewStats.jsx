import React from 'react';
import { StatRenderer, AnimatedStatCard } from '../../ui';
import { 
  ShoppingBag, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Package,
  Clock,
  Star,
  Heart
} from 'lucide-react';

const ClientOverviewStats = ({ stats, loading }) => {
  const statCards = [
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? (loading ? "..." : 0),
      colorTheme: "blue",
      icon: ShoppingBag,
      description: "Orders placed",
      trend: stats?.orderTrend?.direction,
      trendValue: stats?.orderTrend?.percentage
    },
    {
      title: "Total Spent",
      value: stats?.totalSpent ? `$${stats.totalSpent.toLocaleString()}` : (loading ? "..." : "$0"),
      colorTheme: "green",
      icon: DollarSign,
      description: "Total amount spent",
      trend: stats?.spendingTrend?.direction,
      trendValue: stats?.spendingTrend?.percentage
    },
    {
      title: "Active Bookings",
      value: stats?.activeBookings ?? (loading ? "..." : 0),
      colorTheme: "purple",
      icon: Calendar,
      description: "Upcoming appointments",
      trend: stats?.bookingTrend?.direction,
      trendValue: stats?.bookingTrend?.percentage
    },
    {
      title: "Wishlist Items",
      value: stats?.wishlistCount ?? (loading ? "..." : 0),
      colorTheme: "pink",
      icon: Heart,
      description: "Saved items",
    },
    {
      title: "Reviews Given",
      value: stats?.reviewsCount ?? (loading ? "..." : 0),
      colorTheme: "yellow",
      icon: Star,
      description: "Product reviews",
    },
    {
      title: "Member Since",
      value: stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString() : (loading ? "..." : "N/A"),
      colorTheme: "indigo",
      icon: Clock,
      description: "Account creation date",
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-4">
      {statCards.map((card, index) => (
        <AnimatedStatCard 
          key={index} 
          {...card} 
          className="lg:w-[200px]" 
          isLoading={loading}
          duration={1.5}
        />
      ))}
    </div>
  );
};

export default ClientOverviewStats; 