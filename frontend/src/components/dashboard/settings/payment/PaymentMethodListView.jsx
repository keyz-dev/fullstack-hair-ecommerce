import React from 'react';
import { Table, StatusPill, DropdownMenu } from '../../../ui';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const PaymentMethodListView = ({ paymentMethods, loading, onEdit, onDelete, onToggleStatus }) => {
  const columns = [
    {
      Header: "Method",
      accessor: "name",
      Cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium text-primary">{row.name}</div>
          <div className="text-sm text-gray-500">{row.description}</div>
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
          {row.requiresSetup && (
            <StatusPill 
              status="warning" 
              label="Setup Required"
            />
          )}
        </div>
      ),
    },
    {
      Header: "Fees",
      accessor: "fees",
      Cell: ({ row }) => (
        <span className="text-sm text-primary">
          {row.fees > 0 ? `${row.fees}%` : 'No fees'}
        </span>
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
            label: "Edit",
            icon: <Edit size={16} />,
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
        ]

        return (
          <DropdownMenu items={menuItems} />
        )
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