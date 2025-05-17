import HeaderAdmin from "@/components/admin/header-admin";
import SidebarAdmin from "@/components/admin/sidebar-admin";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      <SidebarAdmin />
      <div className="w-full">
        <HeaderAdmin />
        <div className="mx-8 my-5 h-[calc(100vh-110px)] overflow-y-auto border rounded-xl p-5 bg-gray-50 dark:bg-gray-950 shadow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;
