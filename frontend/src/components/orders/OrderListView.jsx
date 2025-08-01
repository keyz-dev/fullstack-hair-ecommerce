import React from "react";
import { Table, StatusPill, DropdownMenu } from "../ui";
import { Edit, Trash2, Eye, Download, Truck } from "lucide-react";
import { OrderStatusBadge, PaymentStatusBadge } from "./";

const OrderListView = ({ onView, onEdit, onDelete, loading, orders }) => {
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

  const columns = React.useMemo(
    () => [
      {
        Header: "Order #",
        accessor: "orderNumber",
        Cell: ({ row }) => (
          <span className="font-semibold text-gray-900">{row.orderNumber}</span>
        ),
      },
      {
        Header: "Customer",
        accessor: "customer",
        Cell: ({ row }) => (
          <div>
            <p className="font-medium text-gray-900">{getCustomerName(row)}</p>
            <p className="text-sm text-gray-500">{row.guestInfo?.email || 'N/A'}</p>
          </div>
        ),
      },
      {
        Header: "Order Status",
        accessor: "status",
        Cell: ({ row }) => (
          <StatusPill status={row.status} />
        ),
      },
      {
        Header: "Items",
        accessor: "items",
        Cell: ({ row }) => (
          <span className="text-sm text-gray-600">
            {row.orderItems?.length || 0} items
          </span>
        ),
      },
      {
        Header: "Total",
        accessor: "totalAmount",
        Cell: ({ row }) => (
          <span className="font-semibold text-gray-900">
            {formatCurrency(row.totalAmount)}
          </span>
        ),
      },
      {
        Header: "Payment Status",
        accessor: "paymentStatus",
        Cell: ({ row }) => (
          <StatusPill status={row.paymentStatus} />
        ),
      },
      {
        Header: "Date",
        accessor: "createdAt",
        Cell: ({ row }) => (
          <span className="text-sm text-gray-600">
            {formatDate(row.createdAt)}
          </span>
        ),
      },
             {
         id: "actions",
         Cell: ({ row }) => {
           const menuItems = [
             {
               label: "View Details",
               icon: <Eye size={16} />,
               onClick: () => onView(row),
             },
             {
               label: "Edit Order",
               icon: <Edit size={16} />,
               onClick: () => onEdit(row),
             },
             {
               label: "Download",
               icon: <Download size={16} />,
               onClick: () => onEdit(row, 'download'),
               disabled: row.paymentStatus !== 'paid',
             },
             {
               label: "Track Order",
               icon: <Truck size={16} />,
               onClick: () => onEdit(row, 'track'),
               disabled: row.status !== 'accepted',
             },
             {
               label: "Delete Order",
               icon: <Trash2 size={16} />,
               onClick: () => onDelete(row),
               isDestructive: true,
             },
           ];
           return (
             <div onClick={(e) => e.stopPropagation()}>
               <DropdownMenu items={menuItems} />
             </div>
           );
         },
       },
    ],
    [onView, onEdit, onDelete]
  );

  return (
    <Table
      columns={columns}
      data={orders}
      isLoading={loading}
      emptyStateMessage="No orders found. Try adjusting your filters or check back later."
      onRowClick={onView}
      clickableRows={true}
    />
  );
};

export default OrderListView; 