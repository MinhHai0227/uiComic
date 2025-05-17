import logo from "@/assets/logo.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface menuType {
  image: ReactNode;
  name: string;
  url: string;
}

const menus: menuType[] = [
  {
    image: (
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
        className="lucide lucide-house-icon lucide-house size-8 lg:size-7"
      >
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
    name: "Home",
    url: "/admin",
  },
  {
    image: (
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
        className="lucide lucide-square-user-round-icon lucide-square-user-round size-8 lg:size-7"
      >
        <path d="M18 21a6 6 0 0 0-12 0" />
        <circle cx="12" cy="11" r="4" />
        <rect width="18" height="18" x="3" y="3" rx="2" />
      </svg>
    ),
    name: "User",
    url: "user",
  },
  {
    image: (
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
        className="lucide lucide-book-icon lucide-book size-8 lg:size-7"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      </svg>
    ),
    name: "Comic",
    url: "comic",
  },
  {
    image: (
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
        className="lucide lucide-clipboard-type-icon lucide-clipboard-type size-8 lg:size-7"
      >
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M9 12v-1h6v1" />
        <path d="M11 17h2" />
        <path d="M12 11v6" />
      </svg>
    ),
    name: "Category",
    url: "category",
  },

  {
    image: (
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
        className="lucide lucide-earth-icon lucide-earth size-8 lg:size-7"
      >
        <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" />
        <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" />
        <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    name: "Country",
    url: "country",
  },
  {
    image: (
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
        className="lucide lucide-coins-icon lucide-coins size-8 lg:size-7"
      >
        <circle cx="8" cy="8" r="6" />
        <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
        <path d="M7 6h1v4" />
        <path d="m16.71 13.88.7.71-2.82 2.82" />
      </svg>
    ),
    name: "Coin",
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
