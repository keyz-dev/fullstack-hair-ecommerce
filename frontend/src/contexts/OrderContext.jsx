import React, { createContext, useContext, useReducer } from 'react';
import { useAuth } from '../hooks';
import { orderApi } from '../api/order';
import { usePaymentTracker } from '../hooks';
import { toast } from 'react-toastify';
import { extractErrorMessage } from '../utils/extractError';

// Initial state
const initialState = {
  orders: [],
  loading: true,
  error: null,
  selectedOrder: null,
  showDetailsModal: false,
  filters: {
    status: 'all',
    dateRange: 'all',
    paymentStatus: 'all',
    search: '',
    customerType: 'all' // Admin-specific filter
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0
  },
  stats: {
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    guestOrders: 0,
    registeredOrders: 0
  }
};

// Action types
const ORDER_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ORDERS: 'SET_ORDERS',
  SET_SELECTED_ORDER: 'SET_SELECTED_ORDER',
  SET_SHOW_DETAILS_MODAL: 'SET_SHOW_DETAILS_MODAL',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  UPDATE_ORDER: 'UPDATE_ORDER',
  DELETE_ORDER: 'DELETE_ORDER',
  REFRESH_ORDERS: 'REFRESH_ORDERS'
};

// Reducer
const orderReducer = (state, action) => {
  switch (action.type) {
    case ORDER_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ORDER_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ORDER_ACTIONS.SET_ORDERS:
      return { 
        ...state, 
        orders: action.payload.orders || [],
        pagination: {
          ...state.pagination,
          total: action.payload.total || action.payload.orders?.length || 0
        },
        loading: false,
        error: null
      };
    
    case ORDER_ACTIONS.SET_SELECTED_ORDER:
      return { ...state, selectedOrder: action.payload };
    
    case ORDER_ACTIONS.SET_SHOW_DETAILS_MODAL:
      return { ...state, showDetailsModal: action.payload };
    
    case ORDER_ACTIONS.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 }
      };
    
    case ORDER_ACTIONS.SET_PAGINATION:
      return { ...state, pagination: { ...state.pagination, ...action.payload } };
    
    case ORDER_ACTIONS.UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map(order => 
          order._id === action.payload._id ? action.payload : order
        )
      };
    
    case ORDER_ACTIONS.DELETE_ORDER:
      return {
        ...state,
        orders: state.orders.filter(order => order._id !== action.payload)
      };
    
    case ORDER_ACTIONS.REFRESH_ORDERS:
      return { ...state, loading: true, error: null };
    
    default:
      return state;
  }
};

// Create context
const OrderContext = createContext();

// Provider component
export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const { user } = useAuth();
  const { trackPayment, isTrackingPayment } = usePaymentTracker();

  // Calculate order statistics
  const calculateStats = (orders) => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'accepted').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      pendingPayments: orders.filter(o => o.paymentStatus === 'pending').length,
      guestOrders: orders.filter(o => !o.user).length,
      registeredOrders: orders.filter(o => o.user).length
    };
  };

  // Fetch all orders (admin access)
  const fetchAllOrders = React.useCallback(async (page = 1) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
      
      const response = await orderApi.getAllOrders({
        page,
        limit: state.pagination.limit,
        status: state.filters.status !== 'all' ? state.filters.status : undefined,
        paymentStatus: state.filters.paymentStatus !== 'all' ? state.filters.paymentStatus : undefined,
        search: state.filters.search || undefined,
        dateRange: state.filters.dateRange !== 'all' ? state.filters.dateRange : undefined
      });
      
      const fetchedOrders = response.orders || [];
      const totalOrders = response.pagination?.total || fetchedOrders.length;
      
      dispatch({
        type: ORDER_ACTIONS.SET_ORDERS,
        payload: { orders: fetchedOrders, total: totalOrders }
      });
      
      // Start tracking payments for pending orders
      fetchedOrders.forEach(order => {
        if (order.paymentStatus === 'pending' && order.paymentReference && !isTrackingPayment(order.paymentReference)) {
          trackPayment(order.paymentReference, order._id, user?._id);
        }
      });
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: 'Failed to load orders. Please try again.' });
      toast.error('Failed to load orders');
    }
  }, [state.pagination.limit, state.filters, trackPayment, isTrackingPayment, user?._id]);

  // Fetch user orders (client access)
  const fetchMyOrders = React.useCallback(async () => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
      
      const response = await orderApi.getMyOrders();
      const fetchedOrders = response.orders || [];
      
      dispatch({
        type: ORDER_ACTIONS.SET_ORDERS,
        payload: { orders: fetchedOrders, total: fetchedOrders.length }
      });
      
      // Start tracking payments for pending orders
      fetchedOrders.forEach(order => {
        if (order.paymentStatus === 'pending' && order.paymentReference && !isTrackingPayment(order.paymentReference)) {
          trackPayment(order.paymentReference, order._id, user?._id);
        }
      });
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: 'Failed to load orders. Please try again.' });
      toast.error('Failed to load orders');
    }
  }, [trackPayment, isTrackingPayment, user?._id]);

  // Filter orders based on current filters
  const getFilteredOrders = () => {
    return state.orders.filter(order => {
      // Customer type filter (admin only)
      if (state.filters.customerType !== 'all') {
        const isGuest = !order.user;
        if (state.filters.customerType === 'guest' && !isGuest) return false;
        if (state.filters.customerType === 'registered' && isGuest) return false;
      }
      
      // Status filter
      if (state.filters.status !== 'all' && order.status !== state.filters.status) {
        return false;
      }
      
      // Payment status filter
      if (state.filters.paymentStatus !== 'all' && order.paymentStatus !== state.filters.paymentStatus) {
        return false;
      }
      
      // Date range filter
      if (state.filters.dateRange !== 'all') {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
        
        switch (state.filters.dateRange) {
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
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        const orderNumber = order.orderNumber?.toLowerCase() || '';
        const customerName = `${order.guestInfo?.firstName || ''} ${order.guestInfo?.lastName || ''}`.toLowerCase();
        
        if (!orderNumber.includes(searchTerm) && !customerName.includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Actions
  const actions = {
    // Order management
    setSelectedOrder: (order) => {
      dispatch({ type: ORDER_ACTIONS.SET_SELECTED_ORDER, payload: order });
    },
    
    setShowDetailsModal: (show) => {
      dispatch({ type: ORDER_ACTIONS.SET_SHOW_DETAILS_MODAL, payload: show });
    },
    
    // Filter management
    setFilter: (filterType, value) => {
      dispatch({ type: ORDER_ACTIONS.SET_FILTERS, payload: { [filterType]: value } });
    },
    
    setSearch: (searchTerm) => {
      dispatch({ type: ORDER_ACTIONS.SET_FILTERS, payload: { search: searchTerm } });
    },
    
    // Pagination
    setPage: (page) => {
      dispatch({ type: ORDER_ACTIONS.SET_PAGINATION, payload: { page } });
    },
    
    // Order actions
    handleOrderAction: async (orderId, action) => {
      try {
        switch (action) {
          case 'accept':
            toast.info('Accept order functionality coming soon');
            break;
          case 'reject':
            toast.info('Reject order functionality coming soon');
            break;
          case 'ship':
            toast.info('Mark as shipped functionality coming soon');
            break;
          case 'deliver':
            toast.info('Mark as delivered functionality coming soon');
            break;
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
    },
    
    // Refresh orders
    refreshOrders: () => {
      dispatch({ type: ORDER_ACTIONS.REFRESH_ORDERS });
    },
    
    // Export orders
    exportOrders: () => {
      toast.info('Export functionality coming soon');
    }
  };

  // Context value
  const value = {
    ...state,
    filteredOrders: getFilteredOrders(),
    stats: calculateStats(state.orders),
    actions,
    fetchAllOrders,
    fetchMyOrders
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the order context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}; 