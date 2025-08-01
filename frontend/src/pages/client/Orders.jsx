import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks';
import { orderApi } from '../../api/order';
import { usePaymentTracker } from '../../hooks';
import { 
  OrderListView, 
  OrderDetailsModal, 
  OrderFilters, 
  OrderStats, 
  OrderTimeline,
  OrderActions
} from '../../components/orders';
import { Button, LoadingSpinner, EmptyState } from '../../components/ui';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const Orders = () => {
  const { user } = useAuth();
  const { trackPayment, isTrackingPayment } = usePaymentTracker();
  
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Filter and search state
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    paymentStatus: 'all',
    search: ''
  });
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  // Fetch orders
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderApi.getMyOrders();
      const fetchedOrders = response.orders || [];
      
      setOrders(fetchedOrders);
      setPagination(prev => ({
        ...prev,
        page,
        total: fetchedOrders.length
      }));
      
      // Start tracking payments for pending orders
      fetchedOrders.forEach(order => {
        if (order.paymentStatus === 'pending' && order.paymentReference && !isTrackingPayment(order.paymentReference)) {
          trackPayment(order.paymentReference, order._id, user?._id);
        }
      });
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Load orders on component mount
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Filter orders based on current filters
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (filters.status !== 'all' && order.status !== filters.status) {
      return false;
    }
    
    // Payment status filter
    if (filters.paymentStatus !== 'all' && order.paymentStatus !== filters.paymentStatus) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
      
      switch (filters.dateRange) {
        case 'today':
          if (daysDiff > 0) return false;
          break;
        case 'week':
          if (daysDiff > 7) return false;
          break;
        case 'month':
          if (daysDiff > 30) return false;
          break;
        default:
          break;
      }
    }
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const orderNumber = order.orderNumber?.toLowerCase() || '';
      const customerName = `${order.guestInfo?.firstName || ''} ${order.guestInfo?.lastName || ''}`.toLowerCase();
      
      if (!orderNumber.includes(searchTerm) && !customerName.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });

  // Handle order view (open modal)
  const handleOrderView = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Handle order edit
  const handleOrderEdit = (order, action) => {
    if (action === 'download') {
      toast.info('Download invoice functionality coming soon');
    } else if (action === 'track') {
      toast.info('Order tracking functionality coming soon');
    } else {
      toast.info('Edit order functionality coming soon');
    }
  };

  // Handle order delete
  const handleOrderDelete = () => {
    toast.info('Delete order functionality coming soon');
  };

  // Handle order actions
  const handleOrderAction = async (orderId, action) => {
    try {
      switch (action) {
        case 'cancel':
          toast.info('Cancel order functionality coming soon');
          break;
        case 'download':
          toast.info('Download invoice functionality coming soon');
          break;
        case 'track':
          toast.info('Order tracking functionality coming soon');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error performing order action:', error);
      toast.error('Failed to perform action');
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Refresh orders
  const handleRefresh = () => {
    fetchOrders(pagination.page, pagination.limit);
  };

  // Calculate order statistics
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'accepted').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalSpent: orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyState
          title="Failed to Load Orders"
          description={error}
          action={
            <Button onClick={handleRefresh} variant="primary">
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="lg:px-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Order Statistics */}
      <OrderStats stats={orderStats} />

      {/* Filters and Search */}
        <OrderFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

      {/* Order List */}
      <div className="">
        <OrderListView
          orders={filteredOrders}
          onView={handleOrderView}
          onEdit={handleOrderEdit}
          onDelete={handleOrderDelete}
          loading={loading}
        />
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onAction={handleOrderAction}
      />
    </div>
  );
};

export default Orders;