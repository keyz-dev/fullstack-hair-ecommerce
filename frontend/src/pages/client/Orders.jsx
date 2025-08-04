import React, { useEffect } from 'react';
import { useAuth, useOrder } from '../../hooks';
import { 
  ClientOrderListView, 
  OrderDetailsModal, 
  OrderFilters, 
  OrderStats, 
} from '../../components/orders';
import { Button, LoadingSpinner, EmptyState } from '../../components/ui';
import { Download, RefreshCw } from 'lucide-react';

const Orders = () => {
  const { user } = useAuth();
  const {
    orders,
    loading,
    error,
    selectedOrder,
    showDetailsModal,
    filters,
    stats: orderStats,
    filteredOrders,
    actions,
    fetchMyOrders
  } = useOrder();

  // Load orders on component mount
  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user, fetchMyOrders]);

  // Handle order view (open modal)
  const handleOrderView = (order) => {
    actions.setSelectedOrder(order);
    actions.setShowDetailsModal(true);
  };

  // Handle order edit
  const handleOrderEdit = (order, action) => {
    if (action === 'download') {
      actions.handleOrderAction(order._id, 'download');
    } else if (action === 'track') {
      actions.handleOrderAction(order._id, 'track');
    } else {
      actions.handleOrderAction(order._id, 'edit');
    }
  };

  // Handle order delete
  const handleOrderDelete = (order) => {
    actions.handleOrderAction(order._id, 'cancel');
  };

  // Handle order actions
  const handleOrderAction = async (orderId, action) => {
    await actions.handleOrderAction(orderId, action);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    actions.setFilter(filterType, value);
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    actions.setSearch(searchTerm);
  };

  // Refresh orders
  const handleRefresh = () => {
    actions.refreshOrders();
    fetchMyOrders();
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
        <ClientOrderListView
          orders={filteredOrders}
          onEdit={handleOrderEdit}
          onDelete={handleOrderDelete}
          loading={loading}
        />
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          actions.setShowDetailsModal(false);
          actions.setSelectedOrder(null);
        }}
        order={selectedOrder}
        onAction={handleOrderAction}
      />
    </div>
  );
};

export default Orders;