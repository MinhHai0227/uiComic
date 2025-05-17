import axios from "@/lib/axios";
import {
  ComicAction,
  comicParams,
  ComicResponseType,
  ComicSlugResponeType,
} from "@/types/comic-type";

const getAllComicApi = async (
  params?: comicParams
): Promise<ComicResponseType> => {
  return await axios.get("comic", {
    params,
  });
};

const getComicBySlugApi = async (
  slug: string
): Promise<ComicSlugResponeType> => {
  return await axios.get(`comic/${slug}`);
};

const setShowHideComicApi = async (id: number) => {
  return await axios.patch(`comic/active/${id}`);
};

const createComicApi = async (data: ComicAction) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("title_eng", data.title_eng);
  formData.append("description", data.description);
  formData.append("slug", data.slug);
  formData.append("author", data.author);
  formData.append("countryId", String(data.countryId));
  data.categoryId.forEach((id) => {
    formData.append("categoryId[]", String(id));
  });
  formData.append("file", data.file);
  return await axios.post("comic", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const editComicApi = async (id: number, data: ComicAction) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("title_eng", data.title_eng);
  formData.append("description", data.description);
  formData.append("slug", data.slug);
  formData.append("author", data.author);
  formData.append("countryId", String(data.countryId));
  data.categoryId.forEach((id) => {
    formData.append("categoryId[]", String(id));
  });
  formData.append("file", data.file);
  return await axios.patch(`comic/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteComicApi = async (id: number) => {
  return await axios.delete(`comic/${id}`);
};

export {
  getAllComicApi,
  setShowHideComicApi,
  createComicApi,
  deleteComicApi,
  editComicApi,
  getComicBySlugApi,
};
