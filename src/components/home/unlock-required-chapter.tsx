import { Link } from "react-router-dom";
import vip from "@/assets/vip.svg";
import dayjs from "dayjs";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import { unlockChapterApi } from "@/services/chapter-action-service";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { checkUserUnlockChapter } from "@/redux/slices/chapter-slice";
import { getUserProfile } from "@/redux/slices/user-slice";

type UnlockRequiredChapterProps = {
  autoUnlock: string;
  priceCoin: number;
  priceUser: number;
  chapterId: number;
};

const UnlockRequiredChapter = ({
  autoUnlock,
  priceCoin,
  priceUser,
  chapterId,
}: UnlockRequiredChapterProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const handleOnUnlockChapter = async (id: number) => {
    try {
      setIsLoading(true);
      await unlockChapterApi(id);
      dispatch(checkUserUnlockChapter(id));
      dispatch(getUserProfile());
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="pb-3 max-w-7xl mx-auto px-3">
      <p className="bg-primary w-full p-3 font-semibold text-white">
        Cần Mở Khóa
      </p>
      <div className="p-1 text-white">
        <img className="size-14 mx-auto" src={vip} alt="Ảnh Chương Vip" />
        <p className="text-center">
          Chương này là chương VIP, để xem nội dung bạn cần{" "}
          <span className="font-semibold text-primary">{priceCoin} xu</span>
        </p>
        <p className="text-center">
          Bạn hiện có:{" "}
          <span className="font-semibold text-primary">{priceUser} xu</span>
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 my-10">
        <Button
          disabled={priceUser < priceCoin || isLoading}
          onClick={() => {
            handleOnUnlockChapter(chapterId);
          }}
          className="text-white w-25 cursor-pointer"
        >
          {isLoading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
          Mở Khóa
        </Button>
        <Link to="/register" className={`${buttonVariants()} text-white w-25`}>
          Nạp Xu
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
export default UnlockRequiredChapter;
