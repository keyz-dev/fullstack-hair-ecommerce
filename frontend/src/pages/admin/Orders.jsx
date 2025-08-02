import React, { useEffect } from 'react';
import { useAuth } from '../../hooks';
import { useOrder } from '../../contexts/OrderContext';
import { 
  AdminOrderListView, 
  OrderDetailsModal, 
  OrderFilters, 
  OrderStats, 
} from '../../components/orders';
import { Button, LoadingSpinner, EmptyState } from '../../components/ui';
import { Download, RefreshCw, Plus } from 'lucide-react';

const Orders = () => {
  const { user } = useAuth();
  const {
    orders,
    loading,
    error,
    selectedOrder,
    showDetailsModal,
    filters,
    pagination,
    stats: orderStats,
    filteredOrders,
    actions,
    fetchAllOrders
  } = useOrder();

  // Load orders on component mount
  useEffect(() => {
    if (user) {
      fetchAllOrders();
    }
  }, [user, fetchAllOrders]);

  // Refetch orders when filters change
  useEffect(() => {
    if (user) {
      fetchAllOrders(1);
    }
  }, [filters, user, fetchAllOrders]);

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
    actions.handleOrderAction(order._id, 'delete');
  };

  // Handle order actions (admin-specific)
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
    fetchAllOrders(pagination.page);
  };

  // Export orders
  const handleExport = () => {
    actions.exportOrders();
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
      {/* Order Statistics */}
      <OrderStats stats={orderStats} />

      {/* Filters and Search */}
      <OrderFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        showCustomerTypeFilter={true} // Admin-specific filter
      />

      {/* Order List */}
      <div className="mt-6">
        <AdminOrderListView
          orders={filteredOrders}
          onView={handleOrderView}
          onEdit={handleOrderEdit}
          onDelete={handleOrderDelete}
          loading={loading}
        />
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAllOrders(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAllOrders(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          actions.setShowDetailsModal(false);
          actions.setSelectedOrder(null);
        }}
        order={selectedOrder}
        onAction={handleOrderAction}
        isAdmin={true} // Enable admin-specific actions
      />
    </div>
  );
};

export default Orders;