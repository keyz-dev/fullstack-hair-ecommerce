import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Phone, ArrowLeft, Download } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { downloadBraidSterInvoice } from '../utils/pdfGenerator';

const OrderTracking = () => {
  const [trackingData, setTrackingData] = useState({
    email: '',
    orderNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrackingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!trackingData.email || !trackingData.orderNumber) {
      setError('Please enter both email and order number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // For now, we'll simulate the API call
      // In a real implementation, you'd call your backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate order found (in real app, this would come from API)
      const mockOrder = {
        orderNumber: trackingData.orderNumber,
        status: 'pending',
        orderDate: new Date().toLocaleDateString(),
        totalAmount: 25000,
        items: [
          { name: 'Sample Product', quantity: 2, price: 12500 }
        ],
        shippingAddress: {
          address: '123 Main St',
          city: 'Douala',
          state: 'Littoral',
          postalCode: '12345',
          country: 'Cameroon'
        },
        estimatedDelivery: '2024-01-15'
      };
      
      setOrderDetails(mockOrder);
    } catch (err) {
      setError('Order not found. Please check your email and order number.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-blue-600 bg-blue-100';
      case 'ready': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'ready': return 'Ready for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const handleDownloadPDF = () => {
    if (orderDetails) {
      const orderData = {
        orderNumber: orderDetails.orderNumber,
        customerInfo: {
          firstName: 'Customer',
          lastName: 'Name',
          email: trackingData.email,
          phone: 'N/A'
        },
        shippingAddress: orderDetails.shippingAddress,
        orderSummary: {
          subtotal: orderDetails.totalAmount,
          shipping: 0,
          tax: 0,
          processingFee: 0,
          total: orderDetails.totalAmount
        },
        selectedPaymentMethod: {
          name: 'Payment Method',
          description: 'Payment details'
        },
        paymentInfo: {},
        cartItems: orderDetails.items
      };
      downloadBraidSterInvoice(orderData);
    }
  };

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
        <h1 className="text-2xl font-bold text-primary">Track Your Order</h1>
      </div>

      {!orderDetails ? (
        <div className="bg-white rounded-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-primary mb-6">Enter Order Details</h2>
          
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={trackingData.email}
              onChangeHandler={handleInputChange}
              required
              placeholder="Enter the email used for the order"
            />
            
            <Input
              label="Order Number"
              name="orderNumber"
              value={trackingData.orderNumber}
              onChangeHandler={handleInputChange}
              required
              placeholder="Enter your order number (e.g., ORD-1234567890)"
            />

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              onClickHandler={handleTrackOrder}
              additionalClasses="w-full bg-accent text-white hover:bg-accent/90"
              isDisabled={isLoading}
            >
              {isLoading ? 'Tracking...' : 'Track Order'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-700 mb-3">
              If you can't find your order, please contact our customer support.
            </p>
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Phone size={16} />
              <span>support@braidcommerce.com</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-primary">Order Status</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderDetails.status)}`}>
                {getStatusText(orderDetails.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Order Number:</strong> {orderDetails.orderNumber}</p>
                <p><strong>Order Date:</strong> {orderDetails.orderDate}</p>
                <p><strong>Total Amount:</strong> {orderDetails.totalAmount.toLocaleString()} XAF</p>
              </div>
              <div>
                <p><strong>Estimated Delivery:</strong> {orderDetails.estimatedDelivery}</p>
                <p><strong>Items:</strong> {orderDetails.items.length} product(s)</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
            <div className="space-y-3">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="w-12 h-12 bg-gray-100 rounded-sm flex-shrink-0 flex items-center justify-center">
                    <Package size={20} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-primary">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-sm">
                    {(item.price * item.quantity).toLocaleString()} XAF
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Shipping Address</h3>
            <div className="text-sm">
              <p>{orderDetails.shippingAddress.address}</p>
              <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.postalCode}</p>
              <p>{orderDetails.shippingAddress.country}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClickHandler={() => {
                setOrderDetails(null);
                setTrackingData({ email: '', orderNumber: '' });
              }}
              additionalClasses="border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Track Another Order
            </Button>
            <Button
              onClickHandler={handleDownloadPDF}
              additionalClasses="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Download size={16} />
              Download Invoice
            </Button>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-xs font-medium hover:bg-accent/90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking; 