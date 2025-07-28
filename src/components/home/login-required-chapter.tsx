import { buttonVariants } from "@/components/ui/button";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const LoginRequiredChapter = ({ autoUnlock }: { autoUnlock: string }) => {
  return (
    <div className="pb-3 max-w-7xl mx-auto px-3">
      <p className="bg-primary w-full p-3 font-semibold text-white">
        Cần Đăng Nhập
      </p>
      <p className="text-center p-3 text-white">
        Chương truyện này đã bị khóa. Bạn cần là thành viên mới có thể đọc được.
      </p>
      <div className="flex items-center justify-center gap-2 my-10">
        <Link to="/login" className={`${buttonVariants()} text-white w-28`}>
          Đăng Nhập
        </Link>
        <Link to="/register" className={`${buttonVariants()} text-white w-28`}>
          Đăng Kí
        </Link>
      </div>
      <p className="text-center text-white">
        Chapter sẽ mở khóa vào{" "}
        <span className="font-semibold">
          {dayjs(autoUnlock).format("HH:mm DD/MM/YYYY")}
        </span>{" "}
      </p>
    </div>
  );
};

export default LoginRequiredChapter;
