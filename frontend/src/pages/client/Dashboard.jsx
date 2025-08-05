import React, { useState } from 'react';
import { 
  ClientOverviewStats, 
  SpendingChart, 
  OrderStatusChart, 
  ActivityTimeline, 
  DateRangePicker 
} from '../../components/dashboard/analytics';
import { useClientAnalytics } from '../../hooks/useClientAnalytics';
import { useAuth } from '../../hooks';
import { RefreshCw, TrendingUp, BarChart3 } from 'lucide-react';
import { Button, FadeInContainer } from '../../components/ui';

const Dashboard = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('30d');
  const { analytics, loading, error, refreshAnalytics } = useClientAnalytics(dateRange);

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-error font-medium">Failed to load dashboard data</p>
          <button 
            onClick={refreshAnalytics}
            className="mt-2 px-4 py-2 bg-error text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeInContainer delay={200} duration={600}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-end gap-2">
            <p className="text-gray-600">Welcome back, </p>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name?.split(' ')[0] || 'User'}!</h1>
          </div>
          <div className="flex items-center gap-3">
            <DateRangePicker 
              onRangeChange={handleDateRangeChange} 
              currentRange={dateRange} 
            />
            <Button
              onClickHandler={refreshAnalytics}
              isDisabled={loading}
              additionalClasses="primarybtn min-h-fit"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </FadeInContainer>

      {/* Overview Stats */}
      <FadeInContainer delay={400} duration={600}>
        <ClientOverviewStats 
          stats={analytics.overview} 
          loading={loading} 
        />
      </FadeInContainer>

      {/* Charts Section */}
      <FadeInContainer delay={600} duration={600}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpendingChart 
            data={analytics.spending?.chartData} 
            loading={loading} 
          />
          <OrderStatusChart 
            data={analytics.orders?.statusDistribution} 
            loading={loading} 
          />
        </div>
      </FadeInContainer>

      {/* Activity Timeline */}
      <FadeInContainer delay={800} duration={600}>
        <ActivityTimeline 
          activities={analytics.activity} 
          loading={loading} 
        />
      </FadeInContainer>

      {/* Quick Actions */}
      <FadeInContainer delay={1000} duration={600}>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">View Orders</p>
              <p className="text-sm text-gray-500">Check your order history</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Book Service</p>
              <p className="text-sm text-gray-500">Schedule an appointment</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Shop Now</p>
              <p className="text-sm text-gray-500">Browse our products</p>
            </div>
          </button>
        </div>
      </div>
      </FadeInContainer>
    </div>
  );
};

export default Dashboard;
