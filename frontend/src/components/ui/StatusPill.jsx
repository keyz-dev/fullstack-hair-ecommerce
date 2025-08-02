import React from "react";

const StatusPill = ({ status }) => {
  const statusStyles = (status) => {
    switch (status.toLowerCase()) {
      case "active":
      case "in_stock":
      case "approved":
      case "completed":
      case "delivered":
      case "paid":
      case "confirmed":
      case "accepted":  
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          dot: "bg-green-400",
        };
      case "inactive":
      case "out_of_stock":
      case "rejected":
      case "invalid":
      case "unavailable":
      case "expired":
      case "cancelled":
      case "failed":
      case "refunded":
      case "declined":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          dot: "bg-red-400",
        };
      case "pending":
      case "available":
      case "limited_stock":
      case "under_maintenance":
      case "processing":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          dot: "bg-blue-400",
        };
      default:
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          dot: "bg-yellow-400",
        };
    }
  };

  const text = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        statusStyles(status).text
      } ${statusStyles(status).bg}`}
    >
      <div
        className={`w-1.5 h-1.5 ${
          statusStyles(status).dot
        } rounded-full mr-1.5`}
      ></div>
      {text}
    </span>
  );
};

export default StatusPill;
