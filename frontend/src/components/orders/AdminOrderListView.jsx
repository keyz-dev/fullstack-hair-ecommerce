import React from "react";
import { Table, StatusPill, DropdownMenu } from "../ui";
import { Edit, Trash2, Eye, Download, Truck, User } from "lucide-react";
import { OrderStatusBadge, PaymentStatusBadge } from "./";
import UserInfo from "../ui/UserInfo";

const AdminOrderListView = ({ onView, onEdit, onDelete, loading, orders }) => {
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

  const getCustomerInfo = (order) => {
    if (order.user) {
      return {
        name: order.user.name || `${order.user.firstName} ${order.user.lastName}`,
        email: order.user.email,
        avatar: order.user.avatar,
        isRegistered: true
      };
    } else if (order.guestInfo) {
      return {
        name: `${order.guestInfo.firstName} ${order.guestInfo.lastName}`,
        email: order.guestInfo.email,
        avatar: null,
        isRegistered: false
      };
    }
    return {
      name: 'Guest User',
      email: 'N/A',
      avatar: null,
      isRegistered: false
    };
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
        Cell: ({ row }) => {
          const customerInfo = getCustomerInfo(row);
          
          if (customerInfo.isRegistered && customerInfo.avatar) {
            return (
              <UserInfo 
                user={{
                  name: customerInfo.name,
                  email: customerInfo.email,
                  avatar: customerInfo.avatar
                }}
              />
            );
          } else {
            return (
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-primary">
                    {customerInfo.name}
                    {!customerInfo.isRegistered && (
                      <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Guest
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{customerInfo.email}</div>
                </div>
              </div>
            );
          }
        },
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
              label: "Edit Order",
              icon: <Edit size={16} />,
              onClick: () => onEdit(row),
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

export default AdminOrderListView; 