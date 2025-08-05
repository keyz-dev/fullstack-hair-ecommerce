import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AdminOverviewStats, 
  RevenueChart, 
  UserGrowthChart, 
  ProductPerformanceChart, 
  AdminActivityTimeline, 
  DateRangePicker 
} from '../../components/dashboard/analytics';
import DashboardErrorBoundary from '../../components/dashboard/analytics/DashboardErrorBoundary';
import DashboardLoadingState from '../../components/dashboard/analytics/DashboardLoadingState';
import { useAdminAnalytics } from '../../hooks/useAdminAnalytics';
import { useAuth } from '../../hooks';
import { RefreshCw, TrendingUp, BarChart3, Settings, Users, Package } from 'lucide-react';
import { Button, FadeInContainer } from '../../components/ui';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('30d');
  const { analytics, loading, error, refreshAnalytics } = useAdminAnalytics(dateRange);

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'products':
        navigate('/admin/products');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      case 'orders':
        navigate('/admin/orders');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <DashboardLoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <DashboardErrorBoundary 
          error={error} 
          onRetry={refreshAnalytics} 
          loading={loading} 
        />
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
            <h1 className="text-2xl font-bold text-gray-900">{user?.name?.split(' ')[0] || 'Admin'}!</h1>
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
        <AdminOverviewStats 
          stats={analytics.overview} 
          loading={loading} 
        />
      </FadeInContainer>

      {/* Charts Section */}
      <FadeInContainer delay={600} duration={600}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart 
            data={analytics.revenue?.chartData} 
            loading={loading} 
          />
          <UserGrowthChart 
            data={analytics.users?.growthData} 
            loading={loading} 
          />
        </div>
      </FadeInContainer>

      {/* Additional Charts */}
      <FadeInContainer delay={800} duration={600}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductPerformanceChart 
            data={analytics.products?.statusDistribution} 
            loading={loading} 
          />
          <AdminActivityTimeline 
            activities={analytics.activity} 
            loading={loading} 
          />
        </div>
      </FadeInContainer>

      {/* Quick Actions */}
      <FadeInContainer delay={1000} duration={600}>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => handleQuickAction('products')}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors hover:shadow-md"
          >
            <Package className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Manage Products</p>
              <p className="text-sm text-gray-500">Add or edit products</p>
            </div>
          </button>
          <button 
            onClick={() => handleQuickAction('users')}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors hover:shadow-md"
          >
            <Users className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Manage Users</p>
              <p className="text-sm text-gray-500">View user accounts</p>
            </div>
          </button>
          <button 
            onClick={() => handleQuickAction('orders')}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors hover:shadow-md"
          >
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">View Orders</p>
              <p className="text-sm text-gray-500">Process orders</p>
            </div>
          </button>
          <button 
            onClick={() => handleQuickAction('settings')}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors hover:shadow-md"
          >
            <Settings className="w-5 h-5 text-orange-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Settings</p>
              <p className="text-sm text-gray-500">Configure system</p>
            </div>
          </button>
        </div>
      </div>
      </FadeInContainer>

      {/* System Health */}
      <FadeInContainer delay={1200} duration={600}>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Database</p>
              <p className="text-sm text-gray-500">All systems operational</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">API Services</p>
              <p className="text-sm text-gray-500">Running smoothly</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Payment Gateway</p>
              <p className="text-sm text-gray-500">Connected and ready</p>
            </div>
          </div>
        </div>
      </div>
      </FadeInContainer>
    </div>
  );
};

export default Dashboard;