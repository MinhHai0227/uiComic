import { useAppSelector } from "@/redux/hooks";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const user = useAppSelector((state) => state.auth.user);
  if (user && user.role === "user") {
    return <Navigate to="/" replace={true} />;
  }
  return <Outlet />;
};

export default AdminRoute;
