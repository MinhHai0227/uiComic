import axios from "@/lib/axios";
import {
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

export { getAllUserApi, deleteUserApi, createUserApi, editUserApi };
