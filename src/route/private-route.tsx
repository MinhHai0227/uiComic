import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

const PrivateRoute = () => {
  const isLogin = useAppSelector((state) => state.auth.user !== null);
  if (!isLogin) {
    return <Navigate to="/login" replace={true} />;
  }
  return <Outlet />;
};
export default PrivateRoute;
