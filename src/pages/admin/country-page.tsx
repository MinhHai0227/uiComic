import CreateCountryForm from "@/components/admin/create-country-form";
import EditCountryForm from "@/components/admin/edit-country-form";
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
import { getAllCountry } from "@/redux/slices/country-slice";
import { deleteCountryApi } from "@/services/country-service";
import { CountryAction } from "@/types/country-type";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
const CountryPage = () => {
  const [openEditDialog, setEditOpenDialog] = useState(false);
  const [openDeleteDialog, setDeleteOpenDialog] = useState(false);
  const [country, setCountry] = useState<CountryAction | null>(null);
  const [selectedCountryId, setselectedCountryId] = useState<number | null>(
    null
  );
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.country);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllCountry());
  }, [dispatch]);

  const handleOnDeleteCountry = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteCountryApi(id);
      dispatch(getAllCountry());
      setselectedCountryId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnEditCountry = () => {
    setEditOpenDialog(false);
    setCountry(null);
    dispatch(getAllCountry());
  };

  return (
    <>
      <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-50">
        Quản Lý Đất Nước
      </h2>
      <div className="mt-[68px] border-t grid lg:grid-cols-3 grid-cols-1 h-full lg:h-119 ">
        <div className="p-2 h-full overflow-y-auto col-span-2 order-2 lg:order-1">
          <Table>
            <TableCaption>Danh sách đất nước của truyện tranh</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead className="text-center">Hành động</TableHead>
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
                data.map((country) => (
                  <TableRow key={country.id}>
                    <TableCell>{country.name}</TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full cursor-pointer"
                        onClick={() => {
                          setEditOpenDialog(true);
                          setCountry({
                            id: country.id,
                            name: country.name,
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
                          setselectedCountryId(country.id);
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
              Thêm Đất Nước
            </h2>
            <p className="text-muted-foreground  text-sm">
              Thêm đất nước của truyện tranh
            </p>
            <div className="py-4">
              <CreateCountryForm />
            </div>
          </div>
        </div>
      </div>
      <AlertDialog open={openDeleteDialog} onOpenChange={setDeleteOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn chắc chắn muốn xoá?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Đất nước sẽ bị xoá vĩnh viễn
              khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading}
              onClick={async () => {
                if (selectedCountryId !== null) {
                  await handleOnDeleteCountry(selectedCountryId);
                }
              }}
            >
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
            {country && (
              <EditCountryForm
                country={country}
                onEditSuccess={handleOnEditCountry}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default CountryPage;
