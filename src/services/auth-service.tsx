import axios from "@/lib/axios";
import {
  ChangePasswordResponse,
  loginType,
  registerType,
} from "@/types/auth-type";

const loginApi = async (data: loginType) => {
  return await axios.post("auth/login", data);
};

const registerApi = async (data: registerType) => {
  return await axios.post("auth/register", data);
};

const logoutApi = async () => {
  return await axios.post("auth/signout");
};

const getProfileApi = async () => {
  return await axios.get("auth/profile");
};

const refetchTokenApi = async () => {
  return await axios.post("auth/refresh-token");
};

const changePasswordApi = async (
  old_password: string,
  new_password: string
): Promise<ChangePasswordResponse> => {
  return await axios.patch("auth/change-password", {
    old_password,
    new_password,
  });
};

const forgotPasswordApi = async (
  email: string
): Promise<{ success: string }> => {
  return await axios.post("auth/send-mailer", { email });
};

const resetPasswordApi = async (
  token: string,
  new_password: string
): Promise<{ success: string }> => {
  return await axios.patch("auth/reset-password", {
    token,
    new_password,
  });
};

export {
  loginApi,
  registerApi,
  logoutApi,
  refetchTokenApi,
  getProfileApi,
  changePasswordApi,
  forgotPasswordApi,
  resetPasswordApi,
};
