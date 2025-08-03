import React, { useEffect } from "react";
import { StatRenderer } from "../../ui";
import { useService } from "../../../hooks";
import { 
  Briefcase, 
  Users, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ServiceStatSection = () => {
  const { stats, fetchStats, loading } = useService();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      title: "Total Services",
      value: stats.total,
      icon: Briefcase,
      colorTheme: "blue",
      description: "All services in the system"
    },
    {
      title: "Active Services",
      value: stats.active,
      icon: CheckCircle,
      colorTheme: "green",
      description: "Services available for booking"
    },
    {
      title: "Draft Services",
      value: stats.draft,
      icon: Clock,
      colorTheme: "yellow",
      description: "Services in development"
    },
    {
      title: "Inactive Services",
      value: stats.inactive,
      icon: XCircle,
      colorTheme: "red",
      description: "Services temporarily disabled"
    },
    {
      title: "With Staff",
      value: stats.withStaff,
      icon: Users,
      colorTheme: "purple",
      description: "Services with assigned staff"
    }
  ];

  return (
    <StatRenderer statCards={statCards} className="lg:w-[230px]" isLoading={loading} />
  );
};

export default ServiceStatSection; 