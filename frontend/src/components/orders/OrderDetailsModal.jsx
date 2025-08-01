import React from 'react';
import { X, MapPin, Phone, Mail, Calendar, Package } from 'lucide-react';
import { OrderStatusBadge, PaymentStatusBadge } from './';
import { ModalWrapper } from '../ui';

const OrderDetailsModal = ({ isOpen, onClose, order, onAction }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCustomerInfo = () => {
    if (order?.guestInfo) {
      return {
        name: `${order.guestInfo.firstName} ${order.guestInfo.lastName}`,
        email: order.guestInfo.email,
        phone: order.guestInfo.phone
      };
    }
    return {
      name: 'Guest User',
      email: 'N/A',
      phone: 'N/A'
    };
  };

  const customerInfo = getCustomerInfo();

  if (!order) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} size="lg">
      <div className="bg-white rounded-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Number and Status */}
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              {order.orderNumber}
            </h4>
            <div className="flex items-center space-x-2 mb-4">
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(order.createdAt)}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">Customer Information</h5>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-16">Name:</span>
                <span className="text-gray-900">{customerInfo.name}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-900">{customerInfo.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-900">{customerInfo.phone}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">Shipping Address</h5>
              <div className="flex items-start text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                <div className="text-gray-900">
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Order Items</h5>
            <div className="space-y-3">
              {order.orderItems?.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.product?.name || 'Product'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">Order Summary</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-gray-900">{formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="text-gray-900">{formatCurrency(order.tax)}</span>
              </div>
              {order.processingFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="text-gray-900">{formatCurrency(order.processingFee)}</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
              <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                {order.notes}
              </p>
            </div>
          )}

          {/* Payment Reference */}
          {order.paymentReference && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Payment Reference</h5>
              <p className="text-sm text-gray-600 font-mono">
                {order.paymentReference}
              </p>
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default OrderDetailsModal; 