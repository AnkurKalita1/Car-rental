import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RoleRoute = ({ role }) => {
  const { user } = useAuth();
  if (user?.role !== role) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default RoleRoute;
