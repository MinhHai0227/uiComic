import { logout } from "@/redux/slices/auth-slice";
import { logoutApi, refetchTokenApi } from "@/services/auth-service";
import { store } from "@/redux/store";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "react-toastify";

// Biến trạng thái quản lý refresh token
let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];
let isSessionExpired = false;

// Tạo Axios instance
const instance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1/",
  withCredentials: true,
  timeout: 5000,
});

// Hàm thêm callback khi refresh xong
const subscribeTokenRefresh = (cb: () => void): void => {
  refreshSubscribers.push(cb);
};

// Gọi lại tất cả request sau khi refresh token
const onRefreshed = (): void => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

// Interceptor request: Truyền config trước khi gửi request
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error)
);

// Interceptor response: Xử lý phản hồi lỗi (đặc biệt là lỗi 401)
instance.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Nếu không có response (lỗi mạng)
    if (!error.response) {
      toast.error("Lỗi mạng hoặc server không phản hồi");
      return Promise.reject(error);
    }

    // Xử lý lỗi 401 - token hết hạn
    if (error.response.status === 401) {
      const { expired, message }: { expired?: boolean; message?: string } =
        error.response.data || {};

      // Token không hết hạn, nhưng thông tin sai
      if (!expired) {
        toast.error(message || "Thông tin đăng nhập không đúng");
        return Promise.reject(error);
      }

      // Token hết hạn và chưa thử refresh token
      if (expired && !originalRequest._retry) {
        if (isRefreshing) {
          // Nếu token đang được refresh, chờ đến khi refresh xong
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh(() => {
              if (isSessionExpired) {
                reject(new Error("Session expired"));
              } else {
                resolve(instance(originalRequest));
              }
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Làm mới token
          await refetchTokenApi();
          isRefreshing = false;
          isSessionExpired = false;
          onRefreshed(); // Gọi lại tất cả request còn lại
          return instance(originalRequest);
        } catch (refreshError: any) {
          // Nếu không thể refresh token, logout và chuyển về trang đăng nhập
          isRefreshing = false;
          refreshSubscribers = [];
          isSessionExpired = true;
          store.dispatch(logout());
          await logoutApi();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }

    // Xử lý lỗi khác
    if (error.response.data && !error.response.data.expired) {
      toast.error(error.response.data.message || error.message);
    }

    return Promise.reject(error);
  }
);

export default instance;
