import Container from "@/components/container";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logoutApi } from "@/services/auth-service";
import { logout } from "@/redux/slices/auth-slice";

type CategoryKey = "category1" | "category2" | "category3";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const isLogin = useSelector((state: RootState) => state.auth.user !== null);

  const handlLogout = async () => {
    const res = await logoutApi();
    if (res) {
      dispatch(logout());
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  const [isVisible, setIsVisible] = useState<Record<CategoryKey, boolean>>({
    category1: false,
    category2: false,
    category3: false,
  });
  const toggleVisible = (category: CategoryKey) => {
    setIsVisible((prevState) => {
      const newValue = !prevState[category];
      if (category === "category1" && newValue === false) {
        return {
          category1: false,
          category2: false,
          category3: false,
        };
      }
      return {
        ...prevState,
        [category]: newValue,
      };
    });
  };
  return (
    <header>
      <Container>
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1">
              <img className="size-9" src={logo} alt="Logo TruyenDocViet" />
              <span className="text-xl uppercase hidden lg:block">
                truyen<span className="text-amber-500">docviet</span>
              </span>
            </Link>
            <Button
              variant={"outline"}
              onClick={toggleTheme}
              className=" border-amber-500 rounded-full size-11 flex justify-center text-amber-500 items-center cursor-pointer hover:text-amber-500"
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
          </div>

          <div className="hidden lg:block lg:w-md relative">
            <input
              className="border-1 border-amber-300 rounded-full h-11 w-full pl-5 pr-11"
              type="text"
              placeholder="Tìm truyện tranh, manhua, manga, webtoon..."
            />
            <button className="absolute right-0 top-1 cursor-pointer hover:text-gray-500 pl-2 pr-3 py-1.5 duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>

          {isLogin ? (
            <ul className="flex gap-2  items-center justify-between">
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-8 text-amber-400"
                    >
                      <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
                      <path
                        fillRule="evenodd"
                        d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 ">
                    <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="py-2 max-h-64 overflow-y-auto">
                      <DropdownMenuItem>
                        <div className="shadow px-1 py-1 rounded-sm w-full cursor-pointer">
                          <p className="font-semibold">
                            QQ vừa trả lời bình luận của bạn
                          </p>
                          <div className="text-xs flex mt-0.5">
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
                                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                            <span>16:46 01/08/2024</span>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="flex justify-between">
                      <DropdownMenuItem className="cursor-pointer text-amber-400">
                        Xem tất cả
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Đánh dấu tất cả đã đọc
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={logo} alt="avatar" />
                      <AvatarFallback>MH</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Tài Khoản Của Tôi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Danh sách theo dõi</DropdownMenuItem>
                      <DropdownMenuItem>Lịch sử đọc truyện</DropdownMenuItem>
                      <DropdownMenuItem>Cài đặt thông tin</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handlLogout}>
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          ) : (
            <ul className="flex gap-2">
              <li>
                <Link to="/register">
                  <Button className="cursor-pointer">Đăng kí</Button>
                </Link>
              </li>
              <li>
                <Link to="/login">
                  <Button className="cursor-pointer">Đăng nhập</Button>
                </Link>
              </li>
            </ul>
          )}
        </div>

        <div className="lg:hidden  relative">
          <input
            className="border-1 border-amber-300 rounded-full h-11 w-full pl-5 pr-11"
            type="text"
            placeholder="Tìm truyện tranh, manhua, manga, webtoon..."
          />
          <button className="absolute right-3 top-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>
      </Container>

      <nav className="bg-amber-500 text-white dark:bg-slate-600 mt-2 relative shadow">
        <Container>
          <ul className="hidden lg:flex gap-2 items-center">
            <li className="hover:bg-amber-400  dark:hover:bg-slate-700 p-3 duration-400">
              <Link to="/" title="Trang chủ" className="py-3">
                Trang Chủ
              </Link>
            </li>
            <li className="cursor-pointer">
              <div className="flex items-center gap-0.5 group  dark:hover:bg-slate-700 hover:bg-amber-400 p-3 duration-400">
                <span>Thể Loại</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="ml-0.5 size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
                <div className="absolute opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 z-10 w-full right-0 top-12 shadow bg-slate-50 text-slate-950 dark:bg-slate-800 dark:text-slate-50 cursor-default">
                  <Container>
                    <div className="my-5 grid grid-cols-8 gap-4 px-3">
                      <p>
                        <Link
                          className="hover:text-amber-500 transition-colors duration-200"
                          to=""
                        >
                          Manhua
                        </Link>
                      </p>
                    </div>
                  </Container>
                </div>
              </div>
            </li>

            <li className="cursor-pointer">
              <div className="flex items-center gap-0.5 group  dark:hover:bg-slate-700 hover:bg-amber-400 p-3 duration-400">
                <span>Xếp Hạng</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="ml-0.5 size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
                <div className="absolute opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 z-10 w-full right-0 top-12 shadow bg-slate-50 text-slate-950 dark:bg-slate-800 dark:text-slate-50 cursor-default">
                  <Container>
                    <div className="my-5 grid grid-cols-8 gap-4 px-3">
                      <p>
                        <Link
                          className="hover:text-amber-500 transition-colors duration-200"
                          to=""
                        >
                          Top Ngày
                        </Link>
                      </p>
                    </div>
                  </Container>
                </div>
              </div>
            </li>
            <li className="hover:bg-amber-400  dark:hover:bg-slate-700 p-3 duration-400">
              <Link to="/" className="py-3">
                Lịch Sử
              </Link>
            </li>
            <li className="hover:bg-amber-400  dark:hover:bg-slate-700 p-3 duration-400">
              <Link to="/" className="py-3">
                Theo Dõi
              </Link>
            </li>
            <li className="hover:bg-amber-400  dark:hover:bg-slate-700 p-3 duration-400">
              <Link to="/" className="py-3">
                Thảo luận
              </Link>
            </li>
            <li className="hover:bg-amber-400  dark:hover:bg-slate-700 p-3 duration-400">
              <Link to="/" className="py-3">
                Fanpage
              </Link>
            </li>
          </ul>
          <div className="lg:hidden relative">
            <p className="hover:bg-amber-400 dark:hover:bg-slate-700 p-3 duration-400 w-full ">
              <Link to="/" className="py-3 pr-50">
                Trang Chủ
              </Link>
            </p>
            <p
              onClick={() => toggleVisible("category1")}
              className="cursor-pointer absolute right-0 top-2"
            >
              {isVisible.category1 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8 mr-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8 mr-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </p>
          </div>
          {isVisible.category1 && (
            <ul className="lg:hidden">
              <li onClick={() => toggleVisible("category2")}>
                <div className="flex items-center gap-1 dark:hover:bg-slate-700 hover:bg-amber-400 p-3 cursor-pointer">
                  <span>Thể Loại</span>
                  <p>
                    {isVisible.category2 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="ml-0.5 size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="ml-0.5 size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    )}
                  </p>
                </div>
                {isVisible.category2 && (
                  <div className="bg-slate-50 text-slate-950 dark:bg-slate-800 dark:text-slate-50 p-3 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                    <p>
                      <Link
                        className="hover:text-amber-500 transition-colors duration-200"
                        to="/"
                      >
                        Manhua
                      </Link>
                    </p>
                  </div>
                )}
              </li>
              <li onClick={() => toggleVisible("category3")}>
                <div className="flex items-center gap-1  dark:hover:bg-slate-700 hover:bg-amber-400 p-3 cursor-pointer">
                  <span>Xếp Hạng</span>
                  <p>
                    {isVisible.category3 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="ml-0.5 size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="ml-0.5 size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    )}
                  </p>
                </div>
                {isVisible.category3 && (
                  <div className="bg-slate-50 text-slate-950 dark:bg-slate-800 dark:text-slate-50 p-3 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                    <p>
                      <Link
                        className="hover:text-amber-500 transition-colors duration-200"
                        to="/"
                      >
                        Top Ngày
                      </Link>
                    </p>
                  </div>
                )}
              </li>
              <li className="hover:bg-amber-400  dark:hover:bg-slate-700 p-3">
                <Link to="/" className="pr-50 ">
                  Lịch Sử
                </Link>
              </li>
              <li className="hover:bg-amber-400  dark:hover:bg-slate-700 p-3">
                <Link to="/" className="pr-50 ">
                  Theo Dõi
                </Link>
              </li>
              <li className="hover:bg-amber-400  dark:hover:bg-slate-700 p-3">
                <Link to="/" className="pr-50 ">
                  Thảo Luận
                </Link>
              </li>
              <li className="hover:bg-amber-400  dark:hover:bg-slate-700 p-3">
                <Link to="/" className="pr-50 ">
                  Fanpage
                </Link>
              </li>
            </ul>
          )}
        </Container>
      </nav>
    </header>
  );
};

export default Header;
