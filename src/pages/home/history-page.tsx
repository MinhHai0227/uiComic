import Container from "@/components/container";
import PaginationComponent from "@/components/pagination-component";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllComicHistory } from "@/redux/slices/comic-history-slice";
import { deleteComicHistoryApi } from "@/services/comic-history-service";
import dayjs from "dayjs";
import { CircleX, Flag, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HistoryPage = () => {
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIdComic, setSelectedIdComic] = useState<number | null>(null);
  const [openDeleteDialog, setDeleteOpenDialog] = useState(false);
  const isLogin = useAppSelector((state) => state.auth.user !== null);
  const comics = useAppSelector((state) => state.comichistory.data);
  const { loading, currentPage, nextPage, prevPage, totalPage } =
    useAppSelector((state) => state.comichistory);

  const handleOnDelete = async (comicId: number) => {
    try {
      if (isLogin) {
        setIsLoading(true);
        await deleteComicHistoryApi(comicId);
        dispatch(getAllComicHistory({ page, limit: 36 }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLogin) {
      dispatch(getAllComicHistory({ page, limit: 36 }));
    }
  }, [dispatch, page]);
  if (!isLogin) {
    return (
      <div className="bg-gray-200 dark:bg-background min-h-[50vh]">
        <Container>
          <div className="flex gap-2 text-sky-400 text-2xl items-center p-3 pt-5">
            <Flag />
            <p>Truyện Đang Theo Dõi</p>
          </div>
          <p className="text-center text-lg font-medium text-gray-600 py-20">
            Vui lòng đăng nhập để xem truyện đang theo dõi.
          </p>
        </Container>
      </div>
    );
  }
  return (
    <div className="bg-gray-200 dark:bg-background pb-2">
      <Container>
        <div className="flex gap-2 text-sky-400 text-2xl items-center p-3 pt-5">
          <Flag />
          <p>Lịch Sử Đọc Truyện</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 mt-4">
          {loading ? (
            <p className="col-span-full flex items-center justify-center text-gray-500 text-lg font-medium py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </p>
          ) : comics && comics.length > 0 ? (
            comics.map((comic) => (
              <div key={comic.id} className="relative">
                <div className="w-full bg-background shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center relative overflow-hidden rounded-sm">
                  <div className="relative w-full">
                    <Link
                      to={`/truyen-tranh/${comic.comic.slug}`}
                      className="block"
                    >
                      <img
                        className="w-full h-54 object-cover"
                        src={comic.comic.cover_image}
                        alt={comic.comic.title}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  </div>
                  <div className="py-2 px-1 w-full">
                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <Link
                            to={`/truyen-tranh/${comic.comic.slug}`}
                            className="font-semibold hover:text-primary transition-colors duration-200 line-clamp-1"
                          >
                            {comic.comic.title}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="center">
                          <p id={`tooltip-${comic.id}`}>{comic.comic.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="mt-1 text-center">
                      <Link
                        to={`/truyen-tranh/${comic.chapter.slug}`}
                        className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
                      >
                        <span>Chapter </span>
                        {comic.chapter.chapter_name}
                      </Link>
                      <div className="absolute left-2 top-2 flex gap-1.5 z-8">
                        <span className="bg-sky-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                          {dayjs(comic.chapter.create_at, "YYYYMMDD").fromNow()}
                        </span>
                        {comic.chapter.views > 1000 && (
                          <span className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                            Hot
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <CircleX
                  className="absolute top-1.5 right-1.5 cursor-pointer "
                  onClick={() => {
                    setSelectedIdComic(comic.comicId);
                    setDeleteOpenDialog(true);
                  }}
                />
              </div>
            ))
          ) : (
            <p className="col-span-full flex items-center justify-center text-gray-500 text-lg font-medium py-8">
              không có truyện tranh
            </p>
          )}
        </div>
        <div className="my-2">
          <PaginationComponent
            onPageChange={setPage}
            currentPage={currentPage ?? 1}
            nextPage={nextPage ?? 1}
            prevPage={prevPage ?? 1}
            totalPage={totalPage ?? 1}
          />
        </div>
        <AlertDialog open={openDeleteDialog} onOpenChange={setDeleteOpenDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn muốn hủy theo dõi?</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn sẽ không biết được thời gian cập nhật chương mới của truyện
                nếu hủy theo dõi.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Thoát</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (selectedIdComic !== null) {
                    await handleOnDelete(selectedIdComic);
                    setSelectedIdComic(null);
                  }
                }}
              >
                {isLoading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                Đồng ý
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Container>
    </div>
  );
};
export default HistoryPage;
