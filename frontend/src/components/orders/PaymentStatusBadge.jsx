import React from 'react';

const PaymentStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          label: 'Payment Pending',
          className: 'bg-orange-100 text-orange-800 border-orange-200'
        };
      case 'paid':
        return {
          label: 'Paid',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'failed':
        return {
          label: 'Payment Failed',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'refunded':
        return {
          label: 'Refunded',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      default:
        return {
          label: status || 'Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
};

export default PaymentStatusBadge; 