import React from 'react';
import { OrderStatusBadge, PaymentStatusBadge } from './';
import { MoreVertical, Eye, Download, Truck } from 'lucide-react';

const OrderItem = ({ order, isSelected, onSelect, onAction }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCustomerName = (order) => {
    if (order.guestInfo) {
      return `${order.guestInfo.firstName} ${order.guestInfo.lastName}`;
    }
    return 'Guest User';
  };

  const handleAction = (action) => {
    onAction(order._id, action);
  };

  return (
    <div 
      className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Order Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {order.orderNumber}
              </h3>
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(order.createdAt)}
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Customer</p>
              <p className="text-sm text-gray-900">{getCustomerName(order)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Items</p>
              <p className="text-sm text-gray-900">
                {order.orderItems?.length || 0} items
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Total</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
          </div>

          {/* Order Items Preview */}
          {order.orderItems && order.orderItems.length > 0 && (
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex -space-x-2">
                {order.orderItems.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center"
                  >
                    <span className="text-xs font-medium text-gray-600">
                      {item.product?.name?.charAt(0) || 'P'}
                    </span>
                  </div>
                ))}
                {order.orderItems.length > 3 && (
                  <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-500">
                      +{order.orderItems.length - 3}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-600">
                {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction('view');
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {order.paymentStatus === 'paid' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction('download');
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Download Invoice"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          
          {order.status === 'accepted' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction('track');
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Track Order"
            >
              <Truck className="w-4 h-4" />
            </button>
          )}
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle more actions dropdown
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="More Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem; 