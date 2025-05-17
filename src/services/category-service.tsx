import axios from "@/lib/axios";
import { Category } from "@/types/category-type";

const getAllCategoryApi = async (): Promise<Category[]> => {
  return await axios.get("category");
};

const createCategoryApi = async (data: Omit<Category, "id">) => {
  return await axios.post("category", data);
};

const deleteCategoryApi = async (id: number) => {
  return axios.delete(`category/${id}`);
};

const editCategoryApi = async (id: number, data: Omit<Category, "id">) => {
  return axios.patch(`category/${id}`, data);
};

export {
  getAllCategoryApi,
  createCategoryApi,
  deleteCategoryApi,
  editCategoryApi,
};
