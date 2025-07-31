import React from 'react';
import { Table, StatusPill, DropdownMenu } from '../../../ui';
import { Edit, Trash2, ToggleLeft, ToggleRight, Settings, CheckCircle, AlertCircle } from 'lucide-react';

const PaymentMethodListView = ({ paymentMethods, loading, onEdit, onDelete, onToggleStatus }) => {
  const getTypeLabel = (type) => {
    const typeLabels = {
      'MOBILE_MONEY': 'Mobile Money',
      'BANK_TRANSFER': 'Bank Transfer',
      'CARD_PAYMENT': 'Card Payment',
      'PAYPAL': 'PayPal',
      'CRYPTO': 'Cryptocurrency',
      'CASH_ON_DELIVERY': 'Cash on Delivery',
      'OTHER': 'Other'
    };
    return typeLabels[type] || type;
  };

  const getTypeIcon = (type) => {
    const icons = {
      'MOBILE_MONEY': '📱',
      'BANK_TRANSFER': '🏦',
      'CARD_PAYMENT': '💳',
      'PAYPAL': '🔵',
      'CRYPTO': '₿',
      'CASH_ON_DELIVERY': '💵',
      'OTHER': '⚙️'
    };
    return icons[type] || '⚙️';
  };

  const columns = [
    {
      Header: "Method",
      accessor: "name",
      Cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getTypeIcon(row.type)}</div>
          <div>
            <div className="text-sm font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">{row.description}</div>
            <div className="text-xs text-gray-400 mt-1">
              Type: {getTypeLabel(row.type)}
            </div>
          </div>
        </div>
      ),
    },
    {
      Header: "Configuration",
      accessor: "isConfigured",
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          {row.isConfigured ? (
            <div className="flex items-center text-green-600">
              <CheckCircle size={16} className="mr-1" />
              <span className="text-sm">Configured</span>
            </div>
          ) : row.requiresSetup ? (
            <div className="flex items-center text-orange-600">
              <AlertCircle size={16} className="mr-1" />
              <span className="text-sm">Setup Required</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <span className="text-sm">No Setup Required</span>
            </div>
          )}
        </div>
      ),
    },
    {
      Header: "Type",
      accessor: "isOnline",
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <StatusPill 
            status={row.isOnline ? "online" : "offline"} 
            label={row.isOnline ? "Online" : "Offline"}
          />
          {row.requiresSetup && !row.isConfigured && (
            <StatusPill 
              status="warning" 
              label="Setup Required"
            />
          )}
        </div>
      ),
    },
    {
      Header: "Fees & Limits",
      accessor: "fees",
      Cell: ({ row }) => (
        <div className="text-sm">
          <div className="text-gray-900">
            {row.fees > 0 ? `${row.fees}%` : 'No fees'}
          </div>
          {row.minAmount && row.maxAmount && (
            <div className="text-gray-500 text-xs">
              {row.minAmount} - {row.maxAmount} XAF
            </div>
          )}
        </div>
      ),
    },
    {
      Header: "Status",
      accessor: "isActive",
      Cell: ({ row }) => (
        <StatusPill 
          status={row.isActive ? "active" : "inactive"} 
          label={row.isActive ? "Active" : "Inactive"}
        />
      ),
    },
    {
      id: "actions",
      Cell: ({ row }) => {
        const menuItems = [
          {
            label: row.requiresSetup && !row.isConfigured ? "Configure" : "Edit",
            icon: row.requiresSetup && !row.isConfigured ? <Settings size={16} /> : <Edit size={16} />,
            onClick: () => onEdit(row),
          },
          {
            label: "Toggle Status",
            icon: row.isActive ? <ToggleLeft size={16} /> : <ToggleRight size={16} />,
            onClick: () => onToggleStatus(row),
          },
          {
            label: "Delete",
            icon: <Trash2 size={16} />,
            onClick: () => onDelete(row),
            isDestructive: true,
          },
        ];

        return (
          <DropdownMenu items={menuItems} />
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      data={paymentMethods}
      loading={loading}
      emptyMessage="No payment methods found"
    />
  );
};

export default PaymentMethodListView; 