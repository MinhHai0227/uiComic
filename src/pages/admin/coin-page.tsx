import { Loader2, Pencil, Trash2 } from "lucide-react";
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
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllCoin } from "@/redux/slices/coin-slice";
import { deleteCoinApi } from "@/services/coin-service";
import CreateCoinForm from "@/components/admin/create-coin-form";
import { CoinAction } from "@/types/coin-type";
import EditCoinForm from "@/components/admin/edit-coin-form";

const CoinPage = () => {
  const [openEditDialog, setEditOpenDialog] = useState(false);
  const [openDeleteDialog, setDeleteOpenDialog] = useState(false);
  const [selectedCoinId, setselectedCoinId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coin, setCoin] = useState<CoinAction | null>(null);
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.coin);

  const handleOnDeleteCoin = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteCoinApi(id);
      setselectedCoinId(null);
      setDeleteOpenDialog(false);
      dispatch(getAllCoin());
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnEditCoin = () => {
    setCoin(null);
    setEditOpenDialog(false);
    dispatch(getAllCoin());
  };
  useEffect(() => {
    dispatch(getAllCoin());
  }, [dispatch]);
  return (
    <>
      <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-50">
        Quản Lý Xu
      </h2>
      <div className="mt-[68px] border-t grid lg:grid-cols-3 grid-cols-1 h-full lg:h-119 ">
        <div className="p-2 h-full overflow-y-auto col-span-2 order-2 lg:order-1">
          <Table>
            <TableCaption>Danh sách xu</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Số tiền</TableHead>
                <TableHead>Xu nhận được</TableHead>
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
                data.map((coin) => (
                  <TableRow key={coin.id}>
                    <TableCell>
                      {coin.price.toLocaleString("vi-VN")} VND
                    </TableCell>
                    <TableCell>{coin.coin_amount}</TableCell>

                    <TableCell className="text-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full cursor-pointer"
                        onClick={() => {
                          setEditOpenDialog(true);
                          setCoin({
                            price: coin.price,
                            coin_amount: coin.coin_amount,
                            id: coin.id,
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
                          setselectedCoinId(coin.id);
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
            <h2 className="text-lg leading-none font-semibold">Thêm Xu</h2>
            <p className="text-muted-foreground  text-sm">
              Thêm xu để mở khóa các chương của truyện tranh
            </p>
            <div className="py-4">
              <CreateCoinForm />
            </div>
          </div>
        </div>
      </div>
      <AlertDialog open={openDeleteDialog} onOpenChange={setDeleteOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn chắc chắn muốn xoá?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Xu sẽ bị xoá vĩnh viễn khỏi hệ
              thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (selectedCoinId !== null) {
                  await handleOnDeleteCoin(selectedCoinId);
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
            {coin && (
              <EditCoinForm coin={coin} onEditSuccess={handleOnEditCoin} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default CoinPage;
