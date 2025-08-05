import axios from "@/lib/axios";
import { AddAllImages } from "@/types/chapter-type";

//chapter image
const deleteAllChapterImageApi = async (id: number) => {
  return await axios.delete(`chapterimage/${id}`);
};

const uploadImagesApi = async (data: AddAllImages) => {
  const formData = new FormData();
  formData.append("chapter_id", String(data.chapter_id));
  data.image.forEach((file) => {
    formData.append("image", file);
  });
  return await axios.post("chapterimage", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//unlock
const checkUserUnloclChapterApi = async (id: number): Promise<boolean> => {
  return await axios.get(`chapterunlock/${id}`);
};

const checkManyUserUnlockChapterApi = async (
  ids: number[]
): Promise<{ id: number; locked: boolean }[]> => {
  return await axios.post("chapterunlock/unlock/check-lock", {
    chapter_id: ids,
  });
};

const unlockChapterApi = async (id: number) => {
  return await axios.post(`chapterunlock/${id}`);
};

const unlockManyChapterApi = async (chapterId: number[]) => {
  return await axios.post("chapterunlock/unlock/unlock-many", {
    chapterId,
  });
};

export {
  deleteAllChapterImageApi,
  uploadImagesApi,
  checkUserUnloclChapterApi,
  unlockChapterApi,
  checkManyUserUnlockChapterApi,
  unlockManyChapterApi,
};
