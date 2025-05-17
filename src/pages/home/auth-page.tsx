import { Outlet } from "react-router-dom";

const AuthPage = () => {
  return (
    <div className="min-h-[calc(100vh-168px)] lg:min-h-[calc(100vh-124px)] flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthPage;
