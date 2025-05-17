import { useTheme } from "@/components/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/redux/slices/auth-slice";
import { logoutApi } from "@/services/auth-service";
import { useDispatch } from "react-redux";
import logo from "@/assets/logo.png";
import { useLocation } from "react-router-dom";

const HeaderAdmin = () => {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const paths = useLocation().pathname.split("/");
  const path = paths[paths.length - 1];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  const handlLogout = async () => {
    const res = await logoutApi();
    if (res) {
      dispatch(logout());
    }
  };

  return (
    <header className="h-[70px] flex items-center justify-between px-8  shadow">
      <h1 className="text-base font-medium tracking-tight text-gray-900 dark:text-gray-50 ml-1 capitalize">
        {paths && paths.length > 0 ? (path === "admin" ? "home" : path) : ""}
      </h1>
      <div className="flex items-center gap-5">
        <Button
          variant={"outline"}
          onClick={toggleTheme}
          className=" border-amber-500 rounded-full size-8 flex justify-center text-amber-500 items-center cursor-pointer hover:text-amber-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
            />
          </svg>
        </Button>
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={logo} alt="avatar" />
            <AvatarFallback>MH</AvatarFallback>
          </Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-1 cursor-pointer">
                <span className="text-sm font-bold">Minh Hải</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Tài Khoản Của Tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Cài đặt thông tin</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handlLogout}>
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
export default HeaderAdmin;
