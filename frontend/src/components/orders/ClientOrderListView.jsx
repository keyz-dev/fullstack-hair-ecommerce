import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, StatusPill, DropdownMenu } from "../ui";
import { Edit, Trash2, Eye, Download, Truck, FileText } from "lucide-react";
import { OrderStatusBadge, PaymentStatusBadge } from "./";
import { downloadBraidSterInvoice } from "../../utils/pdfGenerator";

const ClientOrderListView = ({ onEdit, onDelete, loading, orders }) => {
  const navigate = useNavigate();

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

  const handleViewDetails = (order) => {
    console.log('Order data being passed to order confirmation:', order);
    console.log('Order items structure:', order.orderItems);
    
    // Transform order items to match the expected cart format
    const transformedCartItems = (order.orderItems || []).map(item => {
      // Handle both old format (direct product data) and new format (nested product)
      const product = item.product && typeof item.product === 'object' ? item.product : item;
      return {
        _id: item._id,
        name: product.name,
        price: item.unitPrice || product.price,
        quantity: item.quantity,
        images: product.images || [],
        currency: product.currency || 'XAF',
        variant: item.variant
      };
    });
    
    // Prepare order data for the order confirmation page
    const orderData = {
      orderNumber: order.orderNumber,
      customerInfo: order.customerInfo || order.guestInfo,
      shippingAddress: order.shippingAddress,
      orderSummary: {
        subtotal: order.subtotal || 0,
        shipping: order.shipping || 0,
        tax: order.tax || 0,
        total: order.totalAmount || 0,
        processingFee: order.processingFee || 0
      },
      selectedPaymentMethod: order.paymentMethod,
      paymentInfo: order.paymentInfo,
      cartItems: transformedCartItems,
      paymentReference: order.paymentReference,
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      status: order.status,
      isNewOrder: false // This indicates it's an existing order, not a newly placed one
    };
    
    console.log('Processed order data:', orderData);
    
    // Navigate to order confirmation page with order data using React Router
    navigate('/order-confirmation', { 
      state: orderData 
    });
  };

  const handleDownloadInvoice = async (order) => {
    try {
      // Transform order items to match the expected cart format
      const transformedCartItems = (order.orderItems || []).map(item => {
        // Handle both old format (direct product data) and new format (nested product)
        const product = item.product && typeof item.product === 'object' ? item.product : item;
        return {
          _id: item._id,
          name: product.name,
          price: item.unitPrice || product.price,
          quantity: item.quantity,
          images: product.images || [],
          currency: product.currency || 'XAF',
          variant: item.variant
        };
      });

      const orderData = {
        orderNumber: order.orderNumber,
        customerInfo: order.customerInfo || order.guestInfo,
        shippingAddress: order.shippingAddress,
        orderSummary: {
          subtotal: order.subtotal || 0,
          shipping: order.shipping || 0,
          tax: order.tax || 0,
          total: order.totalAmount || 0,
          processingFee: order.processingFee || 0
        },
        selectedPaymentMethod: order.paymentMethod,
        paymentInfo: order.paymentInfo,
        cartItems: transformedCartItems,
        paymentReference: order.paymentReference,
        orderId: order._id
      };
      
      await downloadBraidSterInvoice(orderData);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
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
              label: "View Summary",
              icon: <Eye size={16} />,
              onClick: () => handleViewDetails(row),
            },
            {
              label: "Get Invoice",
              icon: <Download size={16} />,
              onClick: () => handleDownloadInvoice(row),
              disabled: row.paymentStatus !== 'paid',
            },
            {
              label: "Track",
              icon: <Truck size={16} />,
              onClick: () => onEdit(row, 'track'),
              disabled: row.status !== 'accepted',
            },
            {
              label: "Cancel",
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
    [onEdit, onDelete]
  );

  return (
    <Table
      columns={columns}
      data={orders}
      isLoading={loading}
      emptyStateMessage="No orders found. Start shopping to see your orders here."
      onRowClick={handleViewDetails}
      clickableRows={true}
    />
  );
};

export default ClientOrderListView; 