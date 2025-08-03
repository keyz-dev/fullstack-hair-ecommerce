import React from "react";
import { StatRenderer } from "../../ui";
import { Box, CheckCircle, XCircle } from "lucide-react";

const ProductStatSection = ({ stats, loading }) => {
  const statCards = [
    {
      title: "Total Products",
      value: stats?.total ?? (loading ? "..." : 0),
      colorTheme: "blue",
      icon: Box,
      description: "Total number of products in the store",
    },
    {
      title: "In Stock",
      value: stats?.inStock ?? (loading ? "..." : 0),
      colorTheme: "green",
      icon: CheckCircle,
      description: "Products currently in stock",
    },
    {
      title: "Limited Stock",
      value: stats?.limitedStock ?? (loading ? "..." : 0),
      colorTheme: "orange",
      icon: CheckCircle,
      description: "Products with limited stock",
    },
    {
      title: "Out of Stock",
      value: stats?.outOfStock ?? (loading ? "..." : 0),
      colorTheme: "red",
      icon: XCircle,
      description: "Products that are out of stock",
    },
  ];

  return (
    <StatRenderer statCards={statCards} className="lg:w-[230px]" isLoading={loading} />
  );
};

export default ProductStatSection; 