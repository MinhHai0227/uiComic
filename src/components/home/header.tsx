import Container from "@/components/container";
import logo from "@/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { useEffect, useMemo, useState } from "react";
import { logoutApi } from "@/services/auth-service";
import { logout } from "@/redux/slices/auth-slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getAllCategory } from "@/redux/slices/category-slice";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getUserProfile } from "@/redux/slices/user-slice";
import { debounce } from "lodash";
import { searchComic } from "@/redux/slices/search-slice";
import ReplyNotification from "@/components/home/reply-notification";

type CategoryKey = "category1" | "category2" | "category3";
type RatingType = {
  name: string;
  url: string;
};
const ratings: RatingType[] = [
  {
    name: "Top Ngày",
    url: "/top-ngay",
  },
  {
    name: "Top Tuần",
    url: "/top-tuan",
  },
  {
    name: "Top Tháng",
    url: "/top-thang",
  },
];

const Header = () => {
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { loading, data } = useAppSelector((state) => state.category);
  const isLogin = useAppSelector((state) => state.auth.user !== null);
  const user = useAppSelector((state) => state.user.userProfile);
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    if (isLogin) {
      dispatch(getUserProfile());
    }
    dispatch(getAllCategory());
  }, [dispatch, isLogin]);

  //search
  const [keyword, setKeyword] = useState("");
  const comics = useAppSelector((state) => state.search.data);
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        if (value.trim() !== "") {
          dispatch(searchComic({ keyword: value, page: 1, limit: 5 }));
        }
      }, 500),
    [dispatch]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedSearch(value);
  };
  const navigate = useNavigate();

  const handleSearchClick = () => {
    if (keyword.trim() !== "") {
      navigate(`/tim-kiem?keyword=${encodeURIComponent(keyword.trim())}`);
    }
    setKeyword("");
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
              value={keyword}
              onChange={onChange}
              className="border-1 border-amber-300 rounded-full h-11 w-full pl-5 pr-11"
              type="text"
              placeholder="Tìm truyện tranh, manhua, manga, webtoon..."
            />
            <button
              onClick={handleSearchClick}
              className="absolute right-0 top-1 cursor-pointer hover:text-gray-500 pl-2 pr-3 py-1.5 duration-300"
            >
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
            {keyword && comics.length > 0 && (
              <ul className="absolute left-0 top-full mt-2 w-full max-w-md bg-white rounded-lg shadow-lg z-20 max-h-80 overflow-auto border border-gray-100 transition-all duration-200">
                {comics.map((comic) => (
                  <Link
                    to={`truyen-tranh/${comic.slug}`}
                    onClick={() => {
                      setKeyword("");
                    }}
                    key={comic.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={comic.cover_image ?? ""}
                        alt={comic.title}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {comic.title.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">
                        {comic.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </ul>
            )}
          </div>

          {isLogin ? (
            <ul className="flex gap-2  items-center justify-between">
              <li>{user && <ReplyNotification userId={user.id} />}</li>
              <li>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={user?.avatar ?? ""} alt="avatar" />
                      <AvatarFallback>
                        {user?.username.charAt(0).toUpperCase() ??
                          user?.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Tài Khoản Của Tôi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Danh sách theo dõi</DropdownMenuItem>
                      <DropdownMenuItem>Lịch sử đọc truyện</DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          onClick={() => {
                            setOpen(false);
                          }}
                          to="/passport/quan-ly-tai-khoan"
                        >
                          Cài đặt thông tin
                        </Link>
                      </DropdownMenuItem>
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
            <div className="flex gap-2">
              <Link to="/register" className={`${buttonVariants()} w-25`}>
                Đăng Kí
              </Link>

              <Link to="/login" className={`${buttonVariants()} w-25`}>
                Đăng Nhập
              </Link>
            </div>
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
                <ChevronDown className="size-4" />
                <div className="absolute opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 z-10 w-full right-0 top-12 shadow bg-slate-50 text-slate-950 dark:bg-slate-800 dark:text-slate-50 cursor-default">
                  <Container>
                    <div className="my-5 grid grid-cols-8 gap-4 px-3">
                      {loading
                        ? "Đang tải dữ liệu"
                        : data &&
                          data.map((category) => (
                            <p key={category.id}>
                              <Link
                                className="hover:text-amber-500 transition-colors duration-200"
                                to={`/the-loai/${category.slug}`}
                              >
                                {category.name}
                              </Link>
                            </p>
                          ))}
                    </div>
                  </Container>
                </div>
              </div>
            </li>

            <li className="cursor-pointer">
              <div className="flex items-center gap-0.5 group  dark:hover:bg-slate-700 hover:bg-amber-400 p-3 duration-400">
                <span>Xếp Hạng</span>
                <ChevronDown className="size-4" />
                <div className="absolute opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 z-10 w-full right-0 top-12 shadow bg-slate-50 text-slate-950 dark:bg-slate-800 dark:text-slate-50 cursor-default">
                  <Container>
                    <div className="my-5 grid grid-cols-8 gap-4 px-3">
                      {ratings &&
                        ratings.map((rating, index) => (
                          <p key={index}>
                            <Link
                              className="hover:text-amber-500 transition-colors duration-200"
                              to={rating.url}
                            >
                              {rating.name}
                            </Link>
                          </p>
                        ))}
                    </div>
                  </Container>
                </div>
              </div>
            </li>
            <li className="hover:bg-amber-400  dark:hover:bg-slate-700 p-3 duration-400">
              <Link to="/lich-su" className="py-3">
                Lịch Sử
              </Link>
            </li>
            <li className="hover:bg-amber-400  dark:hover:bg-slate-700 p-3 duration-400">
              <Link to="/truyen-dang-theo-doi" className="py-3">
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
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </p>
                </div>
                {isVisible.category2 && (
                  <div className="bg-slate-50 text-slate-950 dark:bg-slate-800 dark:text-slate-50 p-3 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                    {loading
                      ? "Đang tải dữ liệu"
                      : data &&
                        data.map((category) => (
                          <p key={category.id}>
                            <Link
                              className="hover:text-amber-500 transition-colors duration-200"
                              to={`/the-loai/${category.slug}`}
                            >
                              {category.name}
                            </Link>
                          </p>
                        ))}
                  </div>
                )}
              </li>
              <li onClick={() => toggleVisible("category3")}>
                <div className="flex items-center gap-1  dark:hover:bg-slate-700 hover:bg-amber-400 p-3 cursor-pointer">
                  <span>Xếp Hạng</span>
                  <p>
                    {isVisible.category3 ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </p>
                </div>
                {isVisible.category3 && (
                  <div className="bg-slate-50 text-slate-950 dark:bg-slate-800 dark:text-slate-50 p-3 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                    {ratings &&
                      ratings.map((rating, index) => (
                        <p key={index}>
                          <Link
                            className="hover:text-amber-500 transition-colors duration-200"
                            to={rating.url}
                          >
                            {rating.name}
                          </Link>
                        </p>
                      ))}
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
