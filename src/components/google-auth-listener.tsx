import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/slices/auth-slice";
import { useNavigate } from "react-router-dom";

const GoogleAuthListener = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Kiểm tra nguồn (thay localhost:3000 bằng BE thật)
      if (!event.origin.includes("localhost:3000")) return;
      const { data } = event.data;
      if (data) {
        dispatch(
          setUser({
            id: data.id,
            email: data.email,
            role: data.role,
          })
        );
        navigate("/");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [dispatch, navigate]);

  return null;
};

export default GoogleAuthListener;
