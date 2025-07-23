import { useContext } from "react";
import { BaseDashboardContext } from "../contexts/BaseDashboardContext";

export const useBaseDashboard = () => {
    const context = useContext(BaseDashboardContext);
    if (!context) {
      throw new Error('useBaseDashboard must be used within BaseDashboardProvider');
    }
    return context;
  };