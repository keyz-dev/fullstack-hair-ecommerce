import React from 'react';
import { Button } from '../ui';
import { Download, Truck, MessageCircle, RefreshCw, XCircle } from 'lucide-react';

const OrderActions = ({ order, onAction }) => {
  const handleAction = (action) => {
    onAction(order._id, action);
  };

  const getAvailableActions = () => {
    const actions = [];

    // Download invoice - available for paid orders
    if (order.paymentStatus === 'paid') {
      actions.push({
        id: 'download',
        label: 'Download Invoice',
        icon: Download,
        variant: 'outline',
        color: 'text-blue-600 hover:text-blue-700'
      });
    }

    // Track order - available for accepted orders
    if (order.status === 'accepted' || order.status === 'ready') {
      actions.push({
        id: 'track',
        label: 'Track Order',
        icon: Truck,
        variant: 'outline',
        color: 'text-green-600 hover:text-green-700'
      });
    }

    // Contact support - available for all orders
    actions.push({
      id: 'contact',
      label: 'Contact Support',
      icon: MessageCircle,
      variant: 'outline',
      color: 'text-gray-600 hover:text-gray-700'
    });

    // Cancel order - only for pending orders
    if (order.status === 'pending' && order.paymentStatus !== 'paid') {
      actions.push({
        id: 'cancel',
        label: 'Cancel Order',
        icon: XCircle,
        variant: 'outline',
        color: 'text-red-600 hover:text-red-700'
      });
    }

    // Reorder - available for delivered orders
    if (order.status === 'delivered') {
      actions.push({
        id: 'reorder',
        label: 'Reorder',
        icon: RefreshCw,
        variant: 'primary',
        color: 'text-white'
      });
    }

    return actions;
  };

  const availableActions = getAvailableActions();

  if (availableActions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-3">
          {availableActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                onClick={() => handleAction(action.id)}
                variant={action.variant}
                className={`w-full justify-start ${action.color}`}
                size="sm"
              >
                <Icon className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            );
          })}
        </div>

        {/* Quick Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-gray-900">{order._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="text-gray-900">
                {order.paymentMethod?.name || 'N/A'}
              </span>
            </div>
            {order.paymentReference && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Ref:</span>
                <span className="font-mono text-gray-900 text-xs">
                  {order.paymentReference}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderActions; 