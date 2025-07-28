import axios from "@/lib/axios";
import {
  Category,
  categoryParams,
  CategorySlugResponseType,
} from "@/types/category-type";

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

const getCategoryBySlugApi = async (
  slug: string,
  params?: categoryParams
): Promise<CategorySlugResponseType> => {
  return await axios.get(`category/${slug}`, {
    params,
  });
};

export {
  getAllCategoryApi,
  createCategoryApi,
  deleteCategoryApi,
  editCategoryApi,
  getCategoryBySlugApi,
};
