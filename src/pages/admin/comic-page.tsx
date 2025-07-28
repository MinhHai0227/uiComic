import CreateComicForm from "@/components/admin/create-comic-form";
import EditComicForm from "@/components/admin/edit-comic-form";
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
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllComic } from "@/redux/slices/comic-slice";
import { deleteComicApi, setShowHideComicApi } from "@/services/comic-service";
import { ComicEdit } from "@/types/comic-type";

import { EyeIcon, EyeOffIcon, Loader2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ComicPage = () => {
  const [openDeleteDialog, setDeleteOpenDialog] = useState(false);
  const [openAddDialog, setAddOpenDialog] = useState(false);
  const [openEditDialog, setEditOpenDialog] = useState(false);
  const [openActiveDialog, setActiveOpenDialog] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState(5);
  const [active, setActive] = useState<string>("false");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("onGoing");
  const [selectedIdComic, setSelectedIdComic] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [comic, setComic] = useState<ComicEdit | null>(null);
  const dispatch = useAppDispatch();
  const { data, loading, currentPage, nextPage, prevPage, totalPage } =
    useAppSelector((state) => state.comic);

  const handleOnActiveComic = async (id: number) => {
    try {
      setIsLoading(true);
      await setShowHideComicApi(id);
      setActiveOpenDialog(false);
      dispatch(getAllComic({ page, limit, active, search, status }));
      setSelectedIdComic(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnDeleteComic = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteComicApi(id);
      dispatch(getAllComic({ page, limit, active, search, status }));
      setSelectedIdComic(null);
      setDeleteOpenDialog(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnEditComic = () => {
    setEditOpenDialog(false);
    setComic(null);
    dispatch(getAllComic({ page, limit, active, search, status }));
  };

  const handleOnCreateComic = () => {
    setAddOpenDialog(false);
    dispatch(getAllComic({ page, limit, active, search, status }));
  };

  useEffect(() => {
    dispatch(getAllComic({ page, limit, active, search, status }));
  }, [dispatch, page, active, search, status, limit]);
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-50">
          Quản Lý Truyện Tranh
        </h2>
        <Dialog open={openAddDialog} onOpenChange={setAddOpenDialog}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">Thêm truyện mới</Button>
          </DialogTrigger>
          <DialogContent className="min-w-4xl">
            <DialogHeader>
              <DialogTitle>Thêm truyện tranh</DialogTitle>
              <DialogDescription>
                Thêm truyện tranh mới để làm sinh đông website của bạn.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <CreateComicForm onCreateSuccess={handleOnCreateComic} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="my-5 px-3 py-4 rounded-xl bg-white dark:bg-gray-900 flex flex-col lg:flex-row gap-3">
        <div className="relative w-full">
          <Input
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm kiếm theo tên hoặc tên khác ..."
          />
          <Button
            className="absolute right-0 top-0 cursor-pointer"
            variant={"ghost"}
            onClick={() => setSearch(searchInput)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search-icon lucide-search"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
          </Button>
        </div>
        <div className="flex gap-2">
          <Select
            onValueChange={(value) => {
              setActive(value);
            }}
          >
            <SelectTrigger className="max-w-[250px]">
              <SelectValue placeholder="Lọc danh sách truyện theo tình trạng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">
                Danh sách truyện đang hiển thị
              </SelectItem>
              <SelectItem value="true">Dang sách truyện bị ẩn</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="max-w-[250px]">
              <SelectValue placeholder="Lọc danh sách Comic theo tiến độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="onGoing">Đang tiến hành</SelectItem>
              <SelectItem value="complete">Hoàn thành</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="h-[333px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Ảnh</TableHead>
              <TableHead>Tên truyện</TableHead>
              <TableHead>Tên khác</TableHead>
              <TableHead className="text-center">Quản lý chương</TableHead>
              <TableHead className="text-center">Ẩn/Hiện truyện</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center ">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="ml-2 text-lg">Đang tải dữ liệu...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data && data.length > 0 ? (
              data.map((comic) => (
                <TableRow key={comic.id}>
                  <TableCell className="flex items-center justify-center">
                    <img
                      className="w-8"
                      src={comic.cover_image}
                      alt={comic.title}
                    />
                  </TableCell>
                  <TableCell>{comic.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {comic.title_eng == "" ? "Đang cập nhật" : comic.title_eng}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link
                      to={comic.slug}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className:
                          "rounded-xl shadow-md hover:bg-muted transition",
                      })}
                    >
                      Tới quản lý chương
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      onClick={() => {
                        setSelectedIdComic(comic.id);
                        setActiveOpenDialog(true);
                      }}
                      variant={active === "false" ? "destructive" : "outline"}
                      size="sm"
                      className="gap-2 rounded-md cursor-pointer"
                    >
                      {active === "false" ? (
                        <>
                          <EyeOffIcon className="w-4 h-4" />
                          Ẩn
                        </>
                      ) : (
                        <>
                          <EyeIcon className="w-4 h-4" />
                          Hiện
                        </>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full cursor-pointer"
                      onClick={() => {
                        setEditOpenDialog(true);
                        setComic({
                          id: comic.id,
                          title: comic.title,
                          title_eng: comic.title_eng,
                          slug: comic.slug,
                          description: comic.description,
                        });
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-full cursor-pointer"
                      onClick={() => {
                        setDeleteOpenDialog(true);
                        setSelectedIdComic(comic.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Comic không tồn tại
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-12">
        <PaginationComponent
          currentPage={currentPage}
          nextPage={nextPage}
          onPageChange={setPage}
          prevPage={prevPage}
          totalPage={totalPage}
        />
      </div>
      {/* show/hide */}
      <AlertDialog open={openActiveDialog} onOpenChange={setActiveOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn chắc chắn muốn {active === "false" ? "ẩn" : "hiện"} comic?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này có thể hoàn tác. Truyện tranh sẽ{" "}
              {active === "false" ? "ẩn" : "hiện"} khỏi danh sách.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Thoát</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (selectedIdComic !== null) {
                  await handleOnActiveComic(selectedIdComic);
                }
              }}
              className="cursor-pointer"
              disabled={isLoading}
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
              Hành động này không thể hoàn tác. Người dùng sẽ bị xoá vĩnh viễn
              khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Thoát</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (selectedIdComic !== null) {
                  await handleOnDeleteComic(selectedIdComic);
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
        <DialogContent className="min-w-4xl">
          <DialogHeader>
            <DialogTitle>Sửa truyện tranh</DialogTitle>
            <DialogDescription>Sửa các truyện tranh bị lỗi.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {comic && (
              <EditComicForm comic={comic} onEditSuccess={handleOnEditComic} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ComicPage;
