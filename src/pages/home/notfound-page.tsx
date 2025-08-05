import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      <h1 className="text-6xl font-bold text-red-500 mb-4 animate-bounce">
        404
      </h1>
      <p className="text-2xl text-gray-700 mb-6">Trang không tồn tại!</p>
      <p className="text-sm text-gray-500 mb-8 max-w-md">
        Có vẻ như bạn đã đi lạc. Đừng lo, hãy quay về trang chủ để tiếp tục khám
        phá!
      </p>
      <Button
        asChild
        className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-6 py-2 transition-colors duration-150"
      >
        <Link to="/">Quay về trang chủ</Link>
      </Button>
    </div>
  );
};

export default NotFound;
