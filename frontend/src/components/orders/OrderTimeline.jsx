import React from 'react';
import { CheckCircle, Clock, Truck, Package, XCircle } from 'lucide-react';

const OrderTimeline = ({ order }) => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimelineSteps = () => {
    const steps = [
      {
        id: 'ordered',
        title: 'Order Placed',
        description: 'Your order has been placed successfully',
        icon: Package,
        status: 'completed',
        date: order.createdAt
      },
      {
        id: 'payment',
        title: 'Payment',
        description: order.paymentStatus === 'paid' 
          ? 'Payment completed successfully' 
          : order.paymentStatus === 'failed'
          ? 'Payment failed'
          : 'Payment pending',
        icon: CheckCircle,
        status: order.paymentStatus === 'paid' ? 'completed' : 
               order.paymentStatus === 'failed' ? 'failed' : 'pending',
        date: order.paymentTime
      },
      {
        id: 'processing',
        title: 'Processing',
        description: order.status === 'accepted' 
          ? 'Order is being processed' 
          : 'Order processing started',
        icon: Clock,
        status: ['accepted', 'ready', 'delivered'].includes(order.status) ? 'completed' : 
               order.status === 'cancelled' ? 'failed' : 'pending',
        date: order.status === 'accepted' ? order.updatedAt : null
      },
      {
        id: 'ready',
        title: 'Ready for Delivery',
        description: 'Order is ready for delivery',
        icon: Truck,
        status: ['ready', 'delivered'].includes(order.status) ? 'completed' : 
               order.status === 'cancelled' ? 'failed' : 'pending',
        date: order.status === 'ready' ? order.updatedAt : null
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Order has been delivered',
        icon: CheckCircle,
        status: order.status === 'delivered' ? 'completed' : 
               order.status === 'cancelled' ? 'failed' : 'pending',
        date: order.deliveredAt || (order.status === 'delivered' ? order.updatedAt : null)
      }
    ];

    // If order is cancelled, mark all future steps as failed
    if (order.status === 'cancelled') {
      let foundCancelled = false;
      return steps.map(step => {
        if (step.id === 'cancelled') {
          foundCancelled = true;
          return { ...step, status: 'failed' };
        }
        if (foundCancelled) {
          return { ...step, status: 'failed' };
        }
        return step;
      });
    }

    return steps;
  };

  const timelineSteps = getTimelineSteps();

  const getStepIcon = (step) => {
    const Icon = step.icon;
    
    switch (step.status) {
      case 'completed':
        return <Icon className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Icon className="w-5 h-5 text-gray-400" />;
      default:
        return <Icon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepClasses = (step, index) => {
    const baseClasses = "flex items-start space-x-3";
    
    if (step.status === 'completed') {
      return `${baseClasses} text-green-600`;
    } else if (step.status === 'failed') {
      return `${baseClasses} text-red-600`;
    } else if (step.status === 'pending') {
      return `${baseClasses} text-gray-400`;
    }
    
    return baseClasses;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Order Timeline</h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {timelineSteps.map((step, index) => (
            <div key={step.id} className={getStepClasses(step, index)}>
              {/* Icon */}
              <div className="flex-shrink-0">
                {getStepIcon(step)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    {step.title}
                  </h4>
                  {step.date && (
                    <span className="text-xs text-gray-500">
                      {formatDate(step.date)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Notes */}
        {order.status === 'cancelled' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-red-800">Order Cancelled</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              This order has been cancelled. Please contact support if you have any questions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTimeline; 