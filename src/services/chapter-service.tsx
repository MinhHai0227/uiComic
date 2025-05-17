import axios from "@/lib/axios";
import { ChapterAction } from "@/types/chapter-type";

const lockActiveChapterApi = async (id: number) => {
  return await axios.patch(`chapter/active/${id}`);
};

const deleteChapterApi = async (id: number) => {
  return await axios.delete(`chapter/${id}`);
};

const createChapterApi = async (data: Omit<ChapterAction, "id">) => {
  return await axios.post("chapter", data);
};

const editChapterApi = async (
  id: number,
  data: Omit<ChapterAction, "id" | "comic_id">
) => {
  return await axios.patch(`chapter/${id}`, data);
};

export {
  lockActiveChapterApi,
  deleteChapterApi,
  createChapterApi,
  editChapterApi,
};
