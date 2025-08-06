import React, { useEffect } from 'react';
import { useAuth, useOrder } from '../../hooks';
import { 
  AdminOrderListView, 
  OrderDetailsModal, 
  OrderFilters, 
  OrderStats, 
} from '../../components/orders';
import { Button, LoadingSpinner, EmptyState, FadeInContainer, Pagination } from '../../components/ui';

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
      fetchAllOrders(1);
    }
  }, [user, fetchAllOrders]);

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

  // Handle page change
  const handlePageChange = (page) => {
    actions.setPage(page);
  };

  // Refresh orders
  const handleRefresh = () => {
    actions.refreshOrders();
    fetchAllOrders(1);
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
      <FadeInContainer delay={200} duration={600}>
        <OrderStats stats={orderStats} />
      </FadeInContainer>

      {/* Filters and Search */}
      <FadeInContainer delay={400} duration={600}>
        <OrderFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          showCustomerTypeFilter={true} // Admin-specific filter
        />
      </FadeInContainer>

      {/* Order List */}
      <FadeInContainer delay={600} duration={600}>
        <div className="mt-6">
          <AdminOrderListView
            orders={filteredOrders}
            onView={handleOrderView}
            onEdit={handleOrderEdit}
            onDelete={handleOrderDelete}
            loading={loading}
          />
        </div>
      </FadeInContainer>

      {/* Pagination */}
      <FadeInContainer delay={800} duration={600}>
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={handlePageChange}
        />
      </FadeInContainer>

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