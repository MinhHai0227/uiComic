import axios from "@/lib/axios";
import { ReadingHistoryResponse } from "@/types/history-type";

const createComicHistoryApi = async (comicId: number, chapterId: number) => {
  return await axios.post(`comichistory/${comicId}/${chapterId}`);
};

const getAllComicHistoryApi = async (
  page: number,
  limit: number
): Promise<ReadingHistoryResponse> => {
  return await axios.get("comichistory", {
    params: {
      page,
      limit,
    },
  });
};

const deleteComicHistoryApi = async (id: number) => {
  return axios.delete(`comichistory/${id}`);
};

export { createComicHistoryApi, getAllComicHistoryApi, deleteComicHistoryApi };
