import CreateCategoryForm from "@/components/admin/create-category-form";
import EditCategoryForm from "@/components/admin/edit-category-form";
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
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllCategory } from "@/redux/slices/category-slice";
import { deleteCategoryApi } from "@/services/category-service";
import { Category } from "@/types/category-type";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const CategoryPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [openEditDialog, setEditOpenDialog] = useState(false);
  const [category, setcategory] = useState<Category | null>(null);
  const [openDeleteDialog, setDeleteOpenDialog] = useState(false);
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.category);

  const handleOnDeletecategory = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteCategoryApi(id);
      setSelectedCategoryId(null);
      setDeleteOpenDialog(false);
      dispatch(getAllCategory());
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnEditCategory = () => {
    setcategory(null);
    setEditOpenDialog(false);
    dispatch(getAllCategory());
  };

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);
  return (
    <>
      <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-50">
        Quản Lý Thể Loại
      </h2>
      <div className="mt-[68px] border-t grid lg:grid-cols-3 grid-cols-1 h-full lg:h-119 ">
        <div className="p-2 h-full overflow-y-auto col-span-2 order-2 lg:order-1">
          <Table>
            <TableCaption>Danh sách thể loại của truyện tranh</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="ml-2 text-lg">Đang tải dữ liệu...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data && data.length > 0 ? (
                data.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell className="whitespace-normal break-words">
                      {category.description}
                    </TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full cursor-pointer"
                        onClick={() => {
                          setEditOpenDialog(true);
                          setcategory({
                            id: category.id,
                            name: category.name,
                            slug: category.slug,
                            description: category.description,
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
                          setSelectedCategoryId(category.id);
                          setDeleteOpenDialog(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Chưa có thể loại nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="border p-6 col-span-1 order-1 lg:order-2">
          <div className="flex flex-col gap-2 text-center lg:text-left">
            <h2 className="text-lg leading-none font-semibold">
              Thêm Thể Loại
            </h2>
            <p className="text-muted-foreground  text-sm">
              Thêm các thể loại của truyện tranh
            </p>
            <div className="py-4">
              <CreateCategoryForm />
            </div>
          </div>
        </div>
      </div>
      <AlertDialog open={openDeleteDialog} onOpenChange={setDeleteOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn chắc chắn muốn xoá?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Thể loại sẽ bị xoá vĩnh viễn
              khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading}
              onClick={async () => {
                if (selectedCategoryId !== null) {
                  await handleOnDeletecategory(selectedCategoryId);
                }
              }}
            >
              {isLoading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={openEditDialog} onOpenChange={setEditOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa Thể Loại</DialogTitle>
            <DialogDescription>
              Sửa thể loại của truyện tranh .
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {category && (
              <EditCategoryForm
                category={category}
                onEditSuccess={handleOnEditCategory}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryPage;
