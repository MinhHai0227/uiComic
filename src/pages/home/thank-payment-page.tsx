import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ThankYouPayment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4 animate-pulse">
        Cảm ơn đã nạp xu!
      </h1>
      <p className="text-lg text-gray-700 mb-6 max-w-md">
        Thanh toán của bạn đã được xử lý thành công. Bạn sẽ được chuyển về trang
        chủ trong vài giây...
      </p>
      <Button
        asChild
        className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6 py-2 transition-colors duration-150"
      >
        <Link to="/">Quay về trang chủ ngay</Link>
      </Button>
    </div>
  );
};

export default ThankYouPayment;
