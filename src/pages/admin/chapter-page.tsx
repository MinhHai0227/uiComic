import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getComicBySlug } from "@/redux/slices/comic-slice";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  LockKeyhole,
  LockKeyholeOpen,
  Pencil,
  Trash2,
} from "lucide-react";
import moment from "moment";
import {
  deleteChapterApi,
  lockActiveChapterApi,
} from "@/services/chapter-service";
import CreateChapterForm from "@/components/admin/create-chapter-form";
import { ChapterAction } from "@/types/chapter-type";
import EditChapterForm from "@/components/admin/edit-chapter-form";

const ChapterPage = () => {
  const param = useParams();
  const dispatch = useAppDispatch();
  const [openDeleteDialog, setDeleteOpenDialog] = useState(false);
  const [openAddDialog, setAddOpenDialog] = useState(false);
  const [openEditDialog, setEditOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loading, comicSlug } = useAppSelector((state) => state.comic);
  const [openActiveDialog, setOpenActiveDialog] = useState(false);
  const [isLocked, setIsLoacked] = useState<boolean | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(
    null
  );
  const [chapter, setChapter] = useState<ChapterAction | null>(null);
  const data = comicSlug?.chapters;
  useEffect(() => {
    if (param && param.slug) {
      dispatch(getComicBySlug(param.slug));
    }
  }, [dispatch, param.slug]);

  const handleOnLockActiveChapter = async (id: number) => {
    try {
      setIsLoading(true);
      await lockActiveChapterApi(id);
      if (param && param.slug) {
        dispatch(getComicBySlug(param.slug));
      }
      setOpenActiveDialog(false);
      setSelectedChapterId(null);
      setIsLoacked(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOndeleteChapter = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteChapterApi(id);
      setSelectedChapterId(null);
      setDeleteOpenDialog(false);
      if (param && param.slug) {
        dispatch(getComicBySlug(param.slug));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnAddChapter = () => {
    setAddOpenDialog(false);
    if (param && param.slug) {
      dispatch(getComicBySlug(param.slug));
    }
  };

  const handleOnEditChapter = () => {
    setSelectedChapterId(null);
    setChapter(null);
    setEditOpenDialog(false);
    if (param && param.slug) {
      dispatch(getComicBySlug(param.slug));
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-50">
          Quản Lý Chương Truyện
        </h2>
        <Dialog open={openAddDialog} onOpenChange={setAddOpenDialog}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">Thêm Chapter</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm chương truyện</DialogTitle>
              <DialogDescription>
                Thêm chương truyện của truyện tranh.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <CreateChapterForm
                onAddChapterSuccess={handleOnAddChapter}
                comic_id={comicSlug?.id ?? 0}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="h-[390px] mt-[68px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Chap</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-center">Lock</TableHead>
              <TableHead className="text-center">Xu</TableHead>
              <TableHead className="text-center">Auto Unlock</TableHead>
              <TableHead className="text-center">Unlock</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center align-middle">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Đang tải dữ liệu...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data && data.length > 0 ? (
              data.map((chapter) => (
                <TableRow key={chapter.id}>
                  <TableCell className="text-center align-middle font-medium">
                    Chap {chapter.chapter_name}
                  </TableCell>
                  <TableCell className="align-middle text-sm">
                    {chapter.chapter_title || (
                      <span className="italic text-muted-foreground">
                        Đang cập nhật
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center align-middle capitalize">
                    {chapter.is_locked ? (
                      <span className="text-red-600 font-semibold">
                        Đang khóa
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        Đã mở
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    {chapter.price_xu}
                  </TableCell>
                  <TableCell className="text-center align-middle text-sm">
                    {moment(chapter.auto_unlock_time)
                      .utcOffset(7)
                      .format("HH:mm DD/MM/YYYY")}
                  </TableCell>
                  <TableCell className="text-center align-middle text-sm">
                    <Button
                      onClick={() => {
                        setIsLoacked(chapter.is_locked);
                        setSelectedChapterId(chapter.id);
                        setOpenActiveDialog(true);
                      }}
                      variant="ghost"
                      size="sm"
                      className={`gap-1 px-2 py-1 rounded-full transition-colors duration-300 cursor-pointer ${
                        chapter.is_locked
                          ? "text-green-600 hover:bg-green-100"
                          : "text-red-600 hover:bg-red-100"
                      }`}
                    >
                      {chapter.is_locked ? (
                        <>
                          <LockKeyholeOpen className="w-4 h-4" />
                          <span className="text-xs font-medium">Mở</span>
                        </>
                      ) : (
                        <>
                          <LockKeyhole className="w-4 h-4" />
                          <span className="text-xs font-medium">Khóa</span>
                        </>
                      )}
                    </Button>
                  </TableCell>

                  <TableCell className="text-center align-middle space-x-2">
                    <Button
                      onClick={() => {
                        setEditOpenDialog(true);
                        setSelectedChapterId(chapter.id);
                        setChapter({
                          id: chapter.id,
                          comic_id: comicSlug.id ?? 0,
                          chapter_name: chapter.chapter_name,
                          chapter_title: chapter.chapter_title,
                          price_xu: chapter.price_xu,
                          auto_unlock_time: new Date(chapter.auto_unlock_time),
                        });
                      }}
                      variant="outline"
                      size="sm"
                      className="rounded-full cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={() => {
                        setDeleteOpenDialog(true);
                        setSelectedChapterId(chapter.id);
                      }}
                      variant="destructive"
                      size="sm"
                      className="rounded-full cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  Không có chương nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* active */}
      <AlertDialog open={openActiveDialog} onOpenChange={setOpenActiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn chắc chắn muốn {isLocked ? "mở khóa" : "khóa"} chapter ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này có thể hoàn tác. Bạn có thể{" "}
              {isLocked ? "khóa" : "mở khóa"} chapter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Thoát</AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading}
              onClick={async () => {
                if (selectedChapterId !== null) {
                  await handleOnLockActiveChapter(selectedChapterId);
                }
              }}
              className="cursor-pointer"
            >
              {isLoading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Đồng ý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* delete */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setDeleteOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn chắc chắn muốn xoá?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Chương truyênh sẽ bị xoá vĩnh
              viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Thoát</AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading}
              className="cursor-pointer"
              onClick={async () => {
                if (selectedChapterId !== null) {
                  await handleOndeleteChapter(selectedChapterId);
                }
              }}
            >
              {isLoading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Đồng ý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* edit */}
      <Dialog open={openEditDialog} onOpenChange={setEditOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa Chapter</DialogTitle>
            <DialogDescription>
              Sửa các chapter của truyện tranh.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {chapter && (
              <EditChapterForm
                onEditSuccess={handleOnEditChapter}
                chapter={chapter}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChapterPage;
