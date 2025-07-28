import axios from "@/lib/axios";
import { ComicResponseType } from "@/types/comic-type";

const checkUserFollowerComicApi = async (id: number): Promise<boolean> => {
  return await axios.get(`comicfollower/${id}`);
};

const followerComicApi = async (id: number) => {
  return await axios.post(`comicfollower/${id}`);
};

const unFollowerComicApi = async (id: number) => {
  return await axios.delete(`comicfollower/${id}`);
};

const getAllComicFlByUserApi = async (
  page?: number,
  limit?: number
): Promise<ComicResponseType> => {
  return await axios.get("comicfollower", {
    params: { page, limit },
  });
};

export {
  checkUserFollowerComicApi,
  followerComicApi,
  unFollowerComicApi,
  getAllComicFlByUserApi,
};
