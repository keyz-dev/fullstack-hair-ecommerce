import React from 'react';
import { AnimatedStatCard, StaggeredFadeIn } from '../../ui';
import { 
  DollarSign, 
  Users, 
  Package, 
  Calendar,
  TrendingUp,
  ShoppingCart,
  Star,
  Activity
} from 'lucide-react';

const AdminOverviewStats = ({ stats, loading }) => {
  const statCards = [
    {
      title: "Total Revenue",
      value: stats?.totalRevenue ?? (loading ? "..." : 0),
      colorTheme: "green",
      icon: DollarSign,
      description: "Total revenue generated",
      trend: stats?.revenueTrend?.direction,
      trendValue: stats?.revenueTrend?.percentage
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? (loading ? "..." : 0),
      colorTheme: "blue",
      icon: ShoppingCart,
      description: "Orders placed",
      trend: stats?.orderTrend?.direction,
      trendValue: stats?.orderTrend?.percentage
    },
    {
      title: "Active Users",
      value: stats?.activeUsers ?? (loading ? "..." : 0),
      colorTheme: "purple",
      icon: Users,
      description: "Active users this month",
      trend: stats?.userTrend?.direction,
      trendValue: stats?.userTrend?.percentage
    },
    {
      title: "Total Products",
      value: stats?.totalProducts ?? (loading ? "..." : 0),
      colorTheme: "orange",
      icon: Package,
      description: "Products in inventory",
    },
    {
      title: "Active Bookings",
      value: stats?.activeBookings ?? (loading ? "..." : 0),
      colorTheme: "indigo",
      icon: Calendar,
      description: "Upcoming appointments",
      trend: stats?.bookingTrend?.direction,
      trendValue: stats?.bookingTrend?.percentage
    },
    {
      title: "Conversion Rate",
      value: stats?.conversionRate ? `${stats.conversionRate}%` : (loading ? "..." : "0%"),
      colorTheme: "pink",
      icon: TrendingUp,
      description: "Order conversion rate",
    }
  ];

  return (
    <StaggeredFadeIn 
      staggerDelay={150} 
      baseDelay={400} 
      duration={800}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-4"
    >
      {statCards.map((card, index) => (
        <AnimatedStatCard 
          key={index} 
          {...card} 
          className="lg:w-[210px]" 
          isLoading={loading}
          duration={1.5}
        />
      ))}
    </StaggeredFadeIn>
  );
};

export default AdminOverviewStats; 