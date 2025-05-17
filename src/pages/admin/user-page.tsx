import CreateUserForm from "@/components/admin/create-user-form";
import EditUserForm from "@/components/admin/edit-user-form";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { getAllUser } from "@/redux/slices/user-slice";
import { deleteUserApi } from "@/services/user-service";
import { UserEdit } from "@/types/user-type";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const UserPage = () => {
  const dispatch = useAppDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [openDeleteDialog, setDeleteOpenDialog] = useState(false);
  const [openAddDialog, setAddOpenDialog] = useState(false);
  const [openEditDialog, setEditOpenDialog] = useState(false);
  const [user, setUser] = useState<UserEdit | null>(null);
  const { data, loading, currentPage, prevPage, nextPage, totalPage } =
    useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUser({ search, role, page, limit: 6 }));
  }, [dispatch, search, role, page]);

  const handleOnDeleteUser = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteUserApi(id);
      dispatch(getAllUser({ search, role, page, limit: 6 }));
      setDeleteOpenDialog(false);
      setSelectedUserId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnAddUser = () => {
    setAddOpenDialog(false);
    dispatch(getAllUser({ search, role, page, limit: 6 }));
  };

  const handleOnAEditUser = () => {
    setEditOpenDialog(false);
    setUser(null);
    dispatch(getAllUser({ search, role, page, limit: 6 }));
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-50">
          Quản Lý Người Dùng
        </h2>
        <Dialog open={openAddDialog} onOpenChange={setAddOpenDialog}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">Thêm User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm người dùng</DialogTitle>
              <DialogDescription>
                Thêm các vai trò hoặc thành viên trong website của bạn.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <CreateUserForm onSuccess={handleOnAddUser} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="my-5 px-3 py-4 rounded-xl bg-white dark:bg-gray-900 flex flex-col  lg:flex-row gap-3 ">
        <div className="relative w-full">
          <Input
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm kiếm theo tên hoặc email ..."
          />
          <Button
            onClick={() => setSearch(searchInput)}
            className="absolute right-0 top-0 cursor-pointer"
            variant={"ghost"}
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
        <Select
          onValueChange={(value) => {
            setRole(value === "all" ? undefined : value);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Lọc danh sách theo Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[333px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Total Coin</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center ">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="ml-2 text-lg">Đang tải dữ liệu...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data && data.length > 0 ? (
              data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-center">
                    <Avatar className="size-8 mx-auto">
                      <AvatarImage
                        src={user.avatar ? user.avatar : ""}
                        alt="avatar"
                      />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-center">
                    {user.total_coin}
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full cursor-pointer"
                      onClick={() => {
                        setUser({
                          id: user.id,
                          username: user.username ? user.username : "",
                          email: user.email,
                          total_coin: user.total_coin,
                          role: user.role,
                        });
                        setEditOpenDialog(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-full cursor-pointer"
                      onClick={() => {
                        setSelectedUserId(user.id);
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
                <TableCell colSpan={5} className="text-center">
                  Role không tồn tại User
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
              disabled={isLoading}
              onClick={async () => {
                if (selectedUserId !== null) {
                  await handleOnDeleteUser(selectedUserId);
                }
              }}
            >
              {isLoading && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Đồng ý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={openEditDialog} onOpenChange={setEditOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa người dùng</DialogTitle>
            <DialogDescription>
              Sửa các vai trò hoặc thành viên trong website của bạn.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {user && (
              <EditUserForm user={user} onEditSuccess={handleOnAEditUser} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default UserPage;
