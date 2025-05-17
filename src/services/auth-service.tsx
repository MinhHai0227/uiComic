import axios from "@/lib/axios";
import { loginType, registerType } from "@/types/auth-type";

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

export { loginApi, registerApi, logoutApi, refetchTokenApi, getProfileApi };
