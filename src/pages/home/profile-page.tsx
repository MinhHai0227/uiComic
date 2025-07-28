import Container from "@/components/container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/redux/hooks";
import { NavLink, Outlet } from "react-router-dom";

interface menuType {
  name: string;
  url: string;
}

const menus: menuType[] = [
  { name: "Thông tin tài khoản", url: "/passport/quan-ly-tai-khoan" },
  { name: "Nạp xu", url: "/passport/nap-xu" },
  { name: "Lịch sử mở khóa", url: "/passport/lich-su-mo-khoa" },
  { name: "Lịch sử nạp xu", url: "/passport/lich-su-nap-xu" },
  { name: "Đổi mật khẩu", url: "/passport/doi-mat-khau" },
];

const ProfilePage = () => {
  const user = useAppSelector((state) => state.user.userProfile);
  return (
    <div className="bg-gray-200 dark:bg-background overflow-hidden">
      <Container>
        <div className="bg-background  rounded my-5 shadow grid grid-cols-1 lg:grid-cols-5">
          <aside className="bg-gray-300 dark:bg-slate-600 lg:col-span-1">
            <div className="">
              <Avatar className="size-30 mx-auto mt-4">
                <AvatarImage src={user?.avatar ?? ""} alt="avatar" />
                <AvatarFallback className="text-6xl">
                  {user?.username.charAt(0).toUpperCase() ??
                    user?.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-center font-semibold">
                {user?.username ?? user?.email}
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-4 p-2">
              {menus.map((menu, index) => (
                <NavLink
                  key={index}
                  end
                  to={menu.url}
                  className={({ isActive }) =>
                    isActive
                      ? "bg-muted text-primary font-medium rounded-lg px-2 py-1 lg:px-4 lg:py-2 flex items-center gap-5"
                      : "text-muted-foreground px-2 py-1 lg:px-4 lg:py-2 flex items-center gap-5 hover:bg-muted rounded-lg"
                  }
                >
                  {menu.name}
                </NavLink>
              ))}
            </div>
          </aside>
          <article className="lg:col-span-4">
            <Outlet />
          </article>
        </div>
      </Container>
    </div>
  );
};
export default ProfilePage;
