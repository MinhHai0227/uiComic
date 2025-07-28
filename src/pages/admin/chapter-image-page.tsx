import CreateImageForm from "@/components/admin/create-image-form";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getChapterBySlug } from "@/redux/slices/chapter-slice";
import { deleteAllChapterImageApi } from "@/services/chapter-action-service";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ChapterImagePage = () => {
  const param = useParams();
  const [openAddDialog, setAddOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, data } = useAppSelector((state) => state.chapter);
  const chapters = data?.chapterImages;
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (param && param.slug) {
      dispatch(getChapterBySlug(param.slug));
    }
  }, [dispatch, param.slug]);

  const handleOnDeleteChapterImage = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteAllChapterImageApi(id);
      setOpenDeleteDialog(false);
      if (param && param.slug) {
        dispatch(getChapterBySlug(param.slug));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateImages = () => {
    setAddOpenDialog(false);
    if (param && param.slug) {
      dispatch(getChapterBySlug(param.slug));
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-50">
          Quản Lý Ảnh
        </h2>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setOpenDeleteDialog(true);
            }}
            className="cursor-pointer"
            variant={"destructive"}
          >
            Xóa tất cả ảnh
          </Button>
          <Dialog open={openAddDialog} onOpenChange={setAddOpenDialog}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">Thêm tất cả ảnh</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm ảnh</DialogTitle>
                <DialogDescription>
                  Thêm ảnh của truyện tranh.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {data && data.id && (
                  <CreateImageForm
                    onCreateSuccess={handleCreateImages}
                    chapterId={data.id}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="h-[390px] mt-[68px] overflow-y-auto flex flex-wrap gap-4 p-2">
        {loading ? (
          <div className="text-center w-full h-full text-gray-500 text-lg flex items-center justify-center">
            <div className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">
                Đang tải dữ liệu...
              </span>
            </div>
          </div>
        ) : chapters && chapters.length > 0 ? (
          chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="w-[150px] h-[200px] overflow-hidden shadow-md hover:shadow-lg transition duration-300 border bg-white"
            >
              <img
                src={chapter.image_url}
                alt={`${data.slug}-page-${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="text-center w-full h-full text-gray-500 text-lg flex items-center justify-center">
            Không có ảnh nào
          </div>
        )}
      </div>
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn chắc chắn muốn xoá?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Các hình ảnh sẽ bị xoá vĩnh viễn
              khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Thoát</AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={() => {
                handleOnDeleteChapterImage(data?.id ?? 0);
              }}
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              )}
              Đồng ý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
export default ChapterImagePage;
