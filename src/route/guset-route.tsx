import { useAppSelector } from "@/redux/hooks";
import { Navigate, Outlet } from "react-router-dom";

const GusetRoute = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (user) {
    if (user.role === "user") {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default GusetRoute;
