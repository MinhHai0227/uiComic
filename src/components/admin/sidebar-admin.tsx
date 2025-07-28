import logo from "@/assets/logo.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Book,
  BookType,
  Coins,
  Earth,
  House,
  SquareUserRound,
} from "lucide-react";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface menuType {
  image: ReactNode;
  name: string;
  url: string;
}

const menus: menuType[] = [
  {
    image: <House className="size-7" />,
    name: "Trang chủ",
    url: "/admin",
  },
  {
    image: <SquareUserRound className="size-7" />,
    name: "Người dùng",
    url: "user",
  },
  {
    image: <Book className="size-7" />,
    name: "Truyện tranh",
    url: "comic",
  },
  {
    image: <BookType className="size-7" />,
    name: "Thể loại",
    url: "category",
  },

  {
    image: <Earth className="size-7" />,
    name: "Quốc gia",
    url: "country",
  },
  {
    image: <Coins className="size-7" />,
    name: "Xu",
    url: "coin",
  },
];

const SidebarAdmin = () => {
  return (
    <aside className="w-14 lg:w-64 min-h-screen shadow">
      <div className="h-[70px] flex items-center justify-center gap-1">
        <img className="size-8 lg:size-9" src={logo} alt="Logo TruyenDocViet" />
        <span className="text-lg uppercase hidden lg:block">
          truyen<span className="text-amber-500">docviet</span>
        </span>
      </div>
      <div className="p-1.5 lg:p-1 flex flex-col gap-2">
        {menus.map((menu, index) => (
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "bg-muted text-primary font-medium rounded-lg px-2 py-1 lg:px-4 lg:py-2 flex items-center gap-5"
                : "text-muted-foreground px-2 py-1 lg:px-4 lg:py-2 flex items-center gap-5 hover:bg-muted rounded-lg"
            }
            to={menu.url}
            end
            key={index}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>{menu.image}</TooltipTrigger>
                <TooltipContent>
                  <p>{menu.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="hidden lg:block">{menu.name} </p>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default SidebarAdmin;
