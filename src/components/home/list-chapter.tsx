import { useAppSelector } from "@/redux/hooks";
import { checkManyUserUnlockChapterApi } from "@/services/chapter-action-service";
import { createComicHistoryApi } from "@/services/comic-history-service";
import { ChapterSlug } from "@/types/comic-type";
import dayjs from "dayjs";
import { Eye, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type ListChapterProps = {
  chapters: ChapterSlug[];
  comicId: number;
};

type UnlockStatus = {
  [id: number]: boolean;
};

const ListChapter = ({ chapters, comicId }: ListChapterProps) => {
  const isLogin = useAppSelector((state) => state.auth.user !== null);
  const [unlockStatus, setUnlockStatus] = useState<UnlockStatus>({});
  const [isLoading, setIsLoading] = useState(true);
  const handleOnCreateHistory = async (comicId: number, chapterId: number) => {
    if (isLogin) {
      await createComicHistoryApi(comicId, chapterId);
    }
  };

  useEffect(() => {
    const fetchUnlockStatuses = async () => {
      if (isLogin && Array.isArray(chapters) && chapters.length > 0) {
        const lockedChapters = chapters.filter(
          (chapter) => chapter.is_locked === true
        );
        const lockedIds = lockedChapters.map((chapter) => chapter.id);

        try {
          const res = await checkManyUserUnlockChapterApi(lockedIds);
          const statusMap: UnlockStatus = {};
          res.forEach(({ id, locked }) => {
            statusMap[id] = locked;
          });

          setUnlockStatus(statusMap);
        } catch (error) {
          console.error("Lỗi khi kiểm tra trạng thái unlock chương:", error);
        }
      }
      setIsLoading(false);
    };

    fetchUnlockStatuses();
  }, [isLogin, chapters]);

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Đang tải danh sánh chương...</span>
      </div>
    );
  }

  return (
    <div className="m-3 max-h-125 overflow-y-auto border border-gray-300 shadow rounded-sm">
      <div className="p-4 text-gray-600 space-y-1 dark:text-accent-foreground">
        {chapters &&
          chapters.length &&
          chapters.map((chapter) => (
            <Link
              to={`/truyen-tranh/${chapter.slug}`}
              key={chapter.id}
              onClick={() => {
                handleOnCreateHistory(comicId, chapter.id);
              }}
              className="border-b border-gray-200 pb-0.5 flex justify-between hover:text-primary duration-200"
            >
              <div className="flex items-center">
                <p className="w-24">Chương {chapter.chapter_name}</p>
                {chapter.is_locked &&
                  (!isLogin ||
                    (isLogin && unlockStatus[chapter.id] === false)) && (
                    <div className="flex items-center text-primary">
                      <p>{chapter.price_xu}</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-14">
                  <Eye className="size-4" />
                  <span>{chapter.views}</span>
                </div>
                <p className="hidden sm:block">
                  {dayjs(chapter.create_at).format("DD/MM/YYYY")}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default ListChapter;
