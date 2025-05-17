import Login from "@/components/home/login";
import Register from "@/components/home/register";
import { ThemeProvider } from "@/components/theme-provider";
import HomeLayout from "@/layouts/home-layout";
import AuthPage from "@/pages/home/auth-page";
import HomePage from "@/pages/home/home-page";
import { ToastContainer, Zoom } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getProfileApi } from "@/services/auth-service";
import { setUser } from "@/redux/slices/auth-slice";
import GusetRoute from "@/route/guset-route";
import AdminLayout from "@/layouts/admin-layout";
import AdminRoute from "@/route/admin-route";
import { Loader2 } from "lucide-react";
import PrivateRoute from "@/route/private-route";
import UserPage from "@/pages/admin/user-page";
import AdminPage from "@/pages/admin/admin-page";
import CategoryPage from "@/pages/admin/category-page";
import CoinPage from "@/pages/admin/coin-page";
import CountryPage from "@/pages/admin/country-page";
import ComicPage from "@/pages/admin/comic-page";
import ChapterPage from "@/pages/admin/chapter-page";

const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const wasLoggedOut = localStorage.getItem("loggedIn") === "true";
    if (!wasLoggedOut) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await getProfileApi();
        if (res?.data) {
          dispatch(
            setUser({
              id: res.data.id,
              email: res.data.email,
              role: res.data.role,
            })
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Zoom}
      />
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<HomePage />} />
          <Route element={<GusetRoute />}>
            <Route element={<AuthPage />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Route>
        </Route>

        {/* admin route */}
        <Route element={<PrivateRoute />}>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminPage />} />
              <Route path="user" element={<UserPage />} />
              <Route path="category" element={<CategoryPage />} />
              <Route path="coin" element={<CoinPage />} />
              <Route path="country" element={<CountryPage />} />
              <Route path="comic" element={<ComicPage />} />
              <Route path="comic/:slug" element={<ChapterPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
};
export default App;
