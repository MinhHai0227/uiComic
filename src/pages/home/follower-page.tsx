import Container from "@/components/container";
import ComicItem from "@/components/home/comic-item";
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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllcomicFlUser } from "@/redux/slices/comic-slice";
import { unFollowerComicApi } from "@/services/comic-follower-service";
import { CircleX, Flag, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const FollowerPage = () => {
  const dispatch = useAppDispatch();
  const comics = useAppSelector((state) => state.comic.data);
  const { loading, currentPage, nextPage, prevPage, totalPage } =
    useAppSelector((state) => state.comic);
  const currentUser = useAppSelector((state) => state.auth.user);
  const [page, setPage] = useState(1);
  const [openDeleteDialog, setDeleteOpenDialog] = useState(false);
  const [isLoding, setIsLoading] = useState(false);
  const [selectedIdComic, setSelectedIdComic] = useState<number | null>(null);

  const handleOnDeleteComic = async (id: number) => {
    try {
      setIsLoading(true);
      await unFollowerComicApi(id);
      if (currentUser) {
        dispatch(getAllcomicFlUser({ page, limit: 36 }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      dispatch(getAllcomicFlUser({ page, limit: 36 }));
    }
  }, [dispatch, page]);

  if (!currentUser) {
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
          <p>Truyện Đang Theo Dõi</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 mt-4">
          {loading ? (
            <p className="col-span-full flex items-center justify-center text-gray-500 text-lg font-medium py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </p>
          ) : comics && comics.length > 0 ? (
            comics.map((comic) => (
              <div className="relative">
                <ComicItem key={comic.id} comic={comic} />
                <CircleX
                  className="absolute top-1.5 right-1.5 cursor-pointer "
                  onClick={() => {
                    setSelectedIdComic(comic.id);
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
      </Container>
      {/* delete */}
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
            <AlertDialogCancel disabled={isLoding}>Thoát</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (selectedIdComic !== null) {
                  await handleOnDeleteComic(selectedIdComic);
                  setSelectedIdComic(null);
                }
              }}
            >
              {isLoding && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Đồng ý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default FollowerPage;
