import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getNotificationByUser } from "@/redux/slices/notification-slice";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
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
import PaginationComponent from "@/components/pagination-component";
import { deleteNotificationApi } from "@/services/notification-service";

const HistoryPayment = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const { data, loading, currentPage, nextPage, prevPage, totalPage } =
    useAppSelector((state) => state.notification);
  const [selectedIdNotifi, setSelectedIdNotifi] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openDeleteDialog, setDeleteOpenDialog] = useState(false);
  useEffect(() => {
    dispatch(getNotificationByUser({ page, limit: 5, type: "payment" }));
  }, [dispatch, page]);

  const handleDeleteNotifi = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteNotificationApi(id);
      setSelectedIdNotifi(null);
      dispatch(getNotificationByUser({ page, limit: 5, type: "payment" }));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Lịch sử giao dịch
      </h1>
      <div className="rounded-md border bg-white shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%] py-4">Thông báo</TableHead>
              <TableHead className="py-4">Thời gian</TableHead>
              <TableHead className="text-center py-4">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  <div className="flex justify-center items-center py-4">
                    <svg
                      className="animate-spin h-5 w-5 text-blue-500"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium py-4">
                    {item.message}
                  </TableCell>
                  <TableCell className="py-4">
                    {dayjs(item.create_at).format("HH:mm DD/MM/YYYY")}
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-full cursor-pointer"
                      onClick={() => {
                        setDeleteOpenDialog(true);
                        setSelectedIdNotifi(item.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
                if (selectedIdNotifi !== null) {
                  await handleDeleteNotifi(selectedIdNotifi);
                }
              }}
            >
              {isLoading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Đồng ý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
export default HistoryPayment;
