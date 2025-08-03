import React from "react";
import { Table, StatusPill, DropdownMenu } from "../ui";
import { Edit, Trash2, Eye, Download, Truck, FileText } from "lucide-react";
import { OrderStatusBadge, PaymentStatusBadge } from "./";

const ClientOrderListView = ({ onView, onEdit, onDelete, loading, orders }) => {
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
        Header: "Actions",
        Cell: ({ row }) => {
          const menuItems = [
            {
              label: "View Details",
              icon: <Eye size={16} />,
              onClick: () => onView(row),
            },
            {
              label: "View Order Summary",
              icon: <FileText size={16} />,
              onClick: () => {
                // Navigate to order confirmation page with order data
                const orderData = {
                  orderNumber: row.orderNumber,
                  customerInfo: row.customerInfo || row.guestInfo,
                  shippingAddress: row.shippingAddress,
                  orderSummary: {
                    subtotal: row.subtotal,
                    shipping: row.shipping,
                    tax: row.tax,
                    total: row.totalAmount,
                    processingFee: row.processingFee
                  },
                  selectedPaymentMethod: row.paymentMethod,
                  paymentInfo: row.paymentInfo,
                  cartItems: row.orderItems,
                  paymentReference: row.paymentReference,
                  orderId: row._id
                };
                
                // Store order data in sessionStorage for the order confirmation page
                sessionStorage.setItem('orderConfirmationData', JSON.stringify(orderData));
                window.location.href = '/order-confirmation';
              },
            },
            {
              label: "Download Invoice",
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
              label: "Cancel Order",
              icon: <Trash2 size={16} />,
              onClick: () => onDelete(row),
              disabled: row.status !== 'pending',
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
      emptyStateMessage="No orders found. Start shopping to see your orders here."
      onRowClick={onView}
      clickableRows={true}
    />
  );
};

export default ClientOrderListView; 