import React, { useEffect } from "react";
import { StatRenderer } from "../../ui";
import { FolderOpen, CheckCircle, XCircle } from "lucide-react";
import { useCategory } from "../../../hooks/useCategory";

const CategoryStatSection = () => {
  const { stats, fetchCategories, loading } = useCategory();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const statCards = [
    {
      title: "Total Categories",
      value: stats?.total ?? (loading ? "..." : 0),
      colorTheme: "blue",
      icon: FolderOpen,
      description: "Total number of categories",
    },
    {
      title: "Active",
      value: stats?.active ?? (loading ? "..." : 0),
      colorTheme: "green",
      icon: CheckCircle,
      description: "Active categories",
    },
    {
      title: "Inactive",
      value: stats?.inactive ?? (loading ? "..." : 0),
      colorTheme: "red",
      icon: XCircle,
      description: "Inactive categories",
    },
  ];

  return (
    <StatRenderer statCards={statCards} className="lg:w-[230px]" isLoading={loading} />
  );
};

export default CategoryStatSection; 