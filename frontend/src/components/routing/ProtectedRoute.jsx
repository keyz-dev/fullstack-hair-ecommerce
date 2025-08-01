import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks";
import { Loader } from "../ui";
import { BaseDashboardProvider } from "../../contexts/BaseDashboardContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return (
    <BaseDashboardProvider>
      <Outlet />
    </BaseDashboardProvider>
  );
};

export default ProtectedRoute;
