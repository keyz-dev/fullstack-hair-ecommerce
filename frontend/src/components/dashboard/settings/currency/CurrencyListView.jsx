import React from 'react';
import { Table, StatusPill, DropdownMenu } from '../../../ui';
import { Edit, Trash2, Star } from 'lucide-react';

const CurrencyListView = ({ currencies, loading, onEdit, onDelete, onSetBase }) => {
  const columns = [
    {
      Header: "Currency",
      accessor: "code",
      Cell: ({ row }) => (
        <div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">{row.code}</span>
            {row.isBase && (
              <Star size={16} className="ml-2 text-yellow-500 fill-current" />
            )}
          </div>
          <div className="text-sm text-gray-500">{row.name}</div>
        </div>
      ),
    },
    {
      Header: "Symbol",
      accessor: "symbol",
      Cell: ({ row }) => <span className="text-sm text-gray-900">{row.symbol}</span>,
    },
    {
      Header: "Exchange Rate",
      accessor: "exchangeRate",
      Cell: ({ row }) => <span className="text-sm text-gray-900">{row.exchangeRate}</span>,
    },
    {
      Header: "Position",
      accessor: "position",
      Cell: ({ row }) => (
        <span className="text-sm text-gray-900 capitalize">{row.position}</span>
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
      Header: "Actions",
      Cell: ({ row }) => {
        const items = [{
            label: "Edit",
            icon: <Edit size={16} />,
            onClick: () => onEdit(row),
          }];
        
        if(!row.isBase){
          items.push({
              label: "Set as Base",
              icon: <Star size={16} />,
              onClick: () => onSetBase(row),
            },
            {
              label: "Delete",
              icon: <Trash2 size={16} />,
              onClick: () => onDelete(row),
              isDestructive: true,
            },
          )
        } 
        return <DropdownMenu items={items} />;
      },
    },
  ];

  return (
    <Table
      columns={columns}
      data={currencies}
      loading={loading}
      emptyMessage="No currencies found"
    />
  );
};

export default CurrencyListView; 