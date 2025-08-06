import React, { createContext, useReducer } from 'react';
import { useAuth } from '../hooks';
import { orderApi } from '../api/order';
import { usePaymentTracker } from '../hooks';
import { toast } from 'react-toastify';
import { getSessionId } from '../utils/sessionUtils';
import { downloadBraidSterInvoice } from '../utils/pdfGenerator';

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
    limit: 5,
    total: 0,
    totalPages: 1
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
          total: action.payload.total || action.payload.orders?.length || 0,
          totalPages: action.payload.totalPages || Math.ceil((action.payload.total || action.payload.orders?.length || 0) / state.pagination.limit)
        },
        stats: action.payload.stats || state.stats,
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
      
      // Only fetch from server if we don't have orders or if explicitly requested
      const response = await orderApi.getAllOrders({
        page: 1, // Always fetch page 1 to get all orders
        limit: 1000, // Get a large number to have all orders for client-side filtering
        status: undefined, // Don't filter on server - we'll filter client-side
        paymentStatus: undefined,
        search: undefined,
        dateRange: undefined
      });
      
      const fetchedOrders = response.orders || [];
      
      dispatch({
        type: ORDER_ACTIONS.SET_ORDERS,
        payload: { 
          orders: fetchedOrders, 
          total: fetchedOrders.length,
          totalPages: 1 // We'll calculate this client-side
        }
      });
      
      // Start tracking payments for pending orders
      const pendingOrders = fetchedOrders.filter(order => 
        order.paymentStatus === 'pending' && order.paymentReference
      );
      
      if (pendingOrders.length > 0) {
        pendingOrders.forEach(order => {
          if (!isTrackingPayment(order.paymentReference)) {
            const sessionId = user ? null : getSessionId(); // Use session ID for non-authenticated users
            trackPayment(order.paymentReference, order._id, user?._id, sessionId);
          }
        });
      }
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: 'Failed to load orders. Please try again.' });
      toast.error('Failed to load orders');
    }
  }, [trackPayment, isTrackingPayment, user?._id]); // Removed filters dependency

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
      const pendingOrders = fetchedOrders.filter(order => 
        order.paymentStatus === 'pending' && order.paymentReference
      );
      
      if (pendingOrders.length > 0) {
        pendingOrders.forEach(order => {
          if (!isTrackingPayment(order.paymentReference)) {
            const sessionId = user ? null : getSessionId(); // Use session ID for non-authenticated users
            trackPayment(order.paymentReference, order._id, user?._id, sessionId);
          }
        });
      }
      
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

  // Get paginated orders from filtered results
  const getPaginatedOrders = () => {
    const filteredOrders = getFilteredOrders();
    const startIndex = (state.pagination.page - 1) * state.pagination.limit;
    const endIndex = startIndex + state.pagination.limit;
    return filteredOrders.slice(startIndex, endIndex);
  };

  // Calculate pagination info from filtered results
  const getPaginationInfo = () => {
    const filteredOrders = getFilteredOrders();
    const total = filteredOrders.length;
    const totalPages = Math.ceil(total / state.pagination.limit);
    
    return {
      total,
      totalPages,
      currentPage: state.pagination.page
    };
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
      // Reset to page 1 when filters change
      dispatch({ type: ORDER_ACTIONS.SET_PAGINATION, payload: { page: 1 } });
    },
    
    setSearch: (searchTerm) => {
      dispatch({ type: ORDER_ACTIONS.SET_FILTERS, payload: { search: searchTerm } });
      // Reset to page 1 when search changes
      dispatch({ type: ORDER_ACTIONS.SET_PAGINATION, payload: { page: 1 } });
    },
    
    // Pagination
    setPage: (page) => {
      dispatch({ type: ORDER_ACTIONS.SET_PAGINATION, payload: { page } });
    },
    
    // Order actions
    handleOrderAction: async (orderId, action) => {
      try {
        const order = state.orders.find(o => o._id === orderId);
        if (!order) {
          toast.error('Order not found');
          return;
        }

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
            try {
                             const orderData = {
                 orderNumber: order.orderNumber,
                 customerInfo: order.customerInfo || order.guestInfo,
                 shippingAddress: order.shippingAddress,
                 orderSummary: {
                   subtotal: order.subtotal || 0,
                   shipping: order.shipping || 0,
                   tax: order.tax || 0,
                   total: order.totalAmount || 0,
                   processingFee: order.processingFee || 0
                 },
                 selectedPaymentMethod: order.paymentMethod,
                 paymentInfo: order.paymentInfo,
                 cartItems: order.orderItems || [],
                 paymentReference: order.paymentReference,
                 orderId: order._id
               };
              
              await downloadBraidSterInvoice(orderData);
              toast.success('Invoice downloaded successfully');
            } catch (error) {
              console.error('Error downloading invoice:', error);
              toast.error('Failed to download invoice');
            }
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
    filteredOrders: getPaginatedOrders(), // Return paginated filtered orders
    stats: calculateStats(getFilteredOrders()), // Calculate stats from filtered orders
    pagination: {
      ...state.pagination,
      ...getPaginationInfo() // Include calculated pagination info
    },
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

export { OrderContext }