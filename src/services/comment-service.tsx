import axios from "@/lib/axios";
import { addComment, CommentResponse } from "@/types/comment-type";

const getAllComemntByComicIdApi = async (
  id: number
): Promise<CommentResponse> => {
  return await axios.get(`comment/comic/${id}`);
};

const getAllCommentByChapterIdApi = async (
  id: number
): Promise<CommentResponse> => {
  return await axios.get(`comment/chapter/${id}`);
};

const createComment = async (data: addComment) => {
  return await axios.post("comment", data);
};

const deleteCommentApi = async (commentId: number) => {
  return await axios.delete(`comment/${commentId}`);
};
export {
  getAllComemntByComicIdApi,
  createComment,
  deleteCommentApi,
  getAllCommentByChapterIdApi,
};
