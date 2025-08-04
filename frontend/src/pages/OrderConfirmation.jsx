import React, { useState, useEffect } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Mail, Phone, ArrowLeft, Download } from 'lucide-react';
import { Button } from '../components/ui';
import { PaymentTracker } from '../components/payment';
import { formatPrice } from '../utils/priceUtils';
import { useAuth } from '../hooks';
import { downloadBraidSterInvoice } from '../utils/pdfGenerator';
import { orderApi } from '../api/order';

const OrderConfirmation = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get order data from location state, sessionStorage, or fetch by orderId
  const getOrderData = () => {
    if (location.state) {
      return location.state;
    }
    
    // Try to get from sessionStorage if accessed directly
    const storedData = sessionStorage.getItem('orderConfirmationData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Clear the stored data after retrieving it
        sessionStorage.removeItem('orderConfirmationData');
        return parsedData;
      } catch (error) {
        console.error('Error parsing stored order data:', error);
      }
    }
    
    return null;
  };

  // Fetch order data by orderId if not available in state
  const fetchOrderData = async (orderId) => {
    if (!orderId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await orderApi.getOrderById(orderId);
      
      // The backend returns { success: true, order }
      const order = response.order || response.data;
      
      if (!order) {
        throw new Error('Order data not found in response');
      }
      
      // Transform order items to match the expected cart format
      const transformedCartItems = (order.orderItems || []).map(item => {
        // Handle both old format (direct product data) and new format (nested product)
        const product = item.product && typeof item.product === 'object' ? item.product : item;
        return {
          _id: item._id,
          name: product.name,
          price: item.unitPrice || product.price,
          quantity: item.quantity,
          images: product.images || [],
          currency: product.currency || 'XAF',
          variant: item.variant
        };
      });

      // Transform the order data to match the expected format
      const transformedData = {
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
        paymentInfo: order.paymentInfo || {},
        cartItems: transformedCartItems,
        paymentReference: order.paymentReference,
        orderId: order._id,
        paymentStatus: order.paymentStatus,
        status: order.status,
        isNewOrder: false
      };
      
      setOrderData(transformedData);
    } catch (error) {
      console.error('Error fetching order data:', error);
      setError(error.message || 'Failed to load order information');
    } finally {
      setLoading(false);
    }
  };

  // Initialize order data
  useEffect(() => {
    const initialData = getOrderData();
    
    if (initialData) {
      setOrderData(initialData);
    } else {
      // Try to get orderId from URL params
      const orderId = searchParams.get('orderId');
      if (orderId) {
        fetchOrderData(orderId);
      } else {
        setError('No order information available');
      }
    }
  }, [location.state, searchParams]);

  // Check if this is a newly placed order (has thank you message) or existing order
  const isNewOrder = orderData?.isNewOrder || false;
  
  const { 
    orderNumber, 
    customerInfo, 
    shippingAddress, 
    orderSummary, 
    selectedPaymentMethod,
    paymentInfo,
    cartItems = [],
    paymentReference,
    orderId
  } = orderData || {};

  const handleDownloadPDF = () => {
    if (!orderData) return;
    
    const pdfData = {
      orderNumber,
      customerInfo,
      shippingAddress,
      orderSummary,
      selectedPaymentMethod,
      paymentInfo,
      cartItems
    };
    downloadBraidSterInvoice(pdfData);
  };

  // Check if this is a mobile money payment that needs tracking
  // Show payment tracker for new orders OR existing orders with pending payments
  const isMobileMoneyPayment = selectedPaymentMethod?.type === 'MOBILE_MONEY' || 
                              selectedPaymentMethod?.code === 'MOBILE_MONEY' ||
                              selectedPaymentMethod?.code?.toLowerCase().includes('mobile');
  
  const shouldShowPaymentTracker = isMobileMoneyPayment && 
                                  paymentReference && 
                                  orderSummary?.total > 0 &&
                                  (isNewOrder || orderData?.paymentStatus === 'pending');

  // Show loading state
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order information...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !orderNumber) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Order Not Found</h1>
          <p className="text-gray-500 mb-8">
            {error || "Unable to retrieve order information."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xs font-medium hover:bg-accent/90 transition-colors"
            >
              Continue Shopping
            </Link>
            {user && (
              <Link
                to="/client/orders"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xs font-medium hover:bg-gray-50 transition-colors"
              >
                View My Orders
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/shop"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          Back to Shop
        </Link>
      </div>

      {isNewOrder ? (
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary mb-2">Thank You!</h1>
          <p className="text-gray-600">Your order has been placed successfully</p>
        </div>
      ) : (
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary mb-2">Order Summary</h1>
          <p className="text-gray-600">Order details and information</p>
        </div>
      )}

      {/* Payment Tracker for Mobile Money Payments - Only show for new orders */}
      {shouldShowPaymentTracker && (
        <div className="mb-8">
          <PaymentTracker 
            paymentReference={paymentReference}
            orderId={orderId}
            amount={orderSummary?.total}
            phoneNumber={paymentInfo?.mobileNumber || paymentInfo?.phoneNumber || paymentInfo?.phone}
          />
        </div>
      )}

      <div className="bg-white rounded-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">Order Details</h2>
          <span className="text-lg font-bold text-accent">{orderNumber}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {customerInfo?.firstName} {customerInfo?.lastName}</p>
              <p><strong>Email:</strong> {customerInfo?.email}</p>
              <p><strong>Phone:</strong> {customerInfo?.phone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
            <div className="space-y-2 text-sm">
              <p>{shippingAddress?.address}</p>
              <p>{shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.postalCode}</p>
              <p>{shippingAddress?.country}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        {cartItems && cartItems.length > 0 && (
          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="w-12 h-12 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                    <img
                      src={item.images?.[0] || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-primary truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-sm">
                    {formatPrice((item.price || 0) * (item.quantity || 1), item.currency)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="border-t pt-6 mt-6">
          <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(orderSummary?.subtotal || 0, { symbol: 'XAF' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{orderSummary?.shipping === 0 ? 'Free' : formatPrice(orderSummary?.shipping || 0, { symbol: 'XAF' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (VAT):</span>
              <span>{formatPrice(orderSummary?.tax || 0, { symbol: 'XAF' })}</span>
            </div>
            {orderSummary?.processingFee > 0 && (
              <div className="flex justify-between">
                <span>Processing Fee:</span>
                <span>{formatPrice(orderSummary.processingFee, { symbol: 'XAF' })}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total:</span>
              <span>{formatPrice(orderSummary?.total || 0, { symbol: 'XAF' })}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        {selectedPaymentMethod && (
          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Method:</strong> {selectedPaymentMethod.name}</p>
              {selectedPaymentMethod.description && (
                <p><strong>Description:</strong> {selectedPaymentMethod.description}</p>
              )}
              <p><strong>Type:</strong> {selectedPaymentMethod.isOnline ? 'Online Payment' : 'Cash on Delivery'}</p>
              {selectedPaymentMethod.fees > 0 && (
                <p><strong>Processing Fee:</strong> {selectedPaymentMethod.fees}%</p>
              )}
            </div>
          </div>
        )}

        {/* Payment Details (if available) */}
        {paymentInfo && Object.keys(paymentInfo).length > 0 && (
          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Payment Details</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(paymentInfo).map(([key, value]) => (
                <p key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</strong> {value}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Next Steps - Only show for new orders */}
      {isNewOrder && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-6 mb-8">
          <h3 className="font-semibold text-blue-800 mb-4">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800">Order Confirmation Email</p>
                <p className="text-sm text-blue-700">We've sent a confirmation email to {customerInfo?.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800">Order Processing</p>
                <p className="text-sm text-blue-700">Your order will be processed within 24-48 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800">Customer Support</p>
                <p className="text-sm text-blue-700">Need help? Contact us at support@braidcommerce.com</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guest User Notice - Only show for new orders */}
      {isNewOrder && !user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 mb-8">
          <h3 className="font-semibold text-yellow-800 mb-4">Important for Guest Users</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-yellow-600 rounded-full mt-0.5 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-yellow-800">Save Your Order Number</p>
                <p className="text-sm text-yellow-700">
                  Since you checked out as a guest, please save your order number: <strong>{orderNumber}</strong>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-yellow-600 rounded-full mt-0.5 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-yellow-800">Order Tracking</p>
                <p className="text-sm text-yellow-700">
                  You can track your order using your email address and order number. 
                  Consider creating an account for easier order management.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/shop"
          className="inline-flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-xs font-medium hover:bg-accent/90 transition-colors"
        >
          {isNewOrder ? 'Continue Shopping' : 'Back to Shop'}
        </Link>
        
        <Button
          onClickHandler={handleDownloadPDF}
          additionalClasses="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Download size={16} />
          Download Invoice
        </Button>
        
        {user ? (
          <Link
            to={isNewOrder ? "/client/orders" : "/client/orders"}
            className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xs font-medium hover:bg-gray-50 transition-colors"
          >
            {isNewOrder ? 'View My Orders' : 'Back to Orders'}
          </Link>
        ) : (
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Save your order number for tracking: <strong>{orderNumber}</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                to="/track-order"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xs font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Track Order
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-xs font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation; 