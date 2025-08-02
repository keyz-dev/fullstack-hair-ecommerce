import React, { useEffect } from "react";
import { StatCard } from "../../ui";
import { Box, CheckCircle, XCircle } from "lucide-react";
import { useProducts } from "../../../hooks/useProducts";

const ProductStatSection = () => {
  const { stats, fetchStats, loading } = useProducts();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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
      title: "Out of Stock",
      value: stats?.outOfStock ?? (loading ? "..." : 0),
      colorTheme: "red",
      icon: XCircle,
      description: "Products that are out of stock",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-4">
    {statCards.map((stat, index) => (
      <StatCard
        key={index}
        {...stat}
      />
    ))}
  </div>
  );
};

export default ProductStatSection; 