import axios from "@/lib/axios";
import {
  User,
  UserCreate,
  UserEdit,
  userParams,
  userResponseType,
} from "@/types/user-type";

const getAllUserApi = async (
  params?: userParams
): Promise<userResponseType> => {
  return await axios.get("user", {
    params,
  });
};

const deleteUserApi = async (id: number) => {
  return await axios.delete(`user/${id}`);
};

const createUserApi = async (data: UserCreate) => {
  return axios.post("user", data);
};

const editUserApi = async (id: number, data: Omit<UserEdit, "id">) => {
  return axios.patch(`user/${id}`, data);
};

const getUserProfileApi = async (): Promise<User> => {
  return await axios.get("user/profile");
};

const uploadAvatarApi = async ( file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return await axios.post("user/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export {
  getAllUserApi,
  deleteUserApi,
  createUserApi,
  editUserApi,
  getUserProfileApi,
  uploadAvatarApi,
};
