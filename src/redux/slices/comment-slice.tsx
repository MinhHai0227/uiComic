import {
  getAllComemntByComicIdApi,
  getAllCommentByChapterIdApi,
} from "@/services/comment-service";
import { commentParams, CommentResponse } from "@/types/comment-type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllCommentByComicId = createAsyncThunk<
  CommentResponse,
  { id: number; params: commentParams }
>("comment/getAllCommentByComicId", async ({ id, params }, thunkAPI) => {
  try {
    return await getAllComemntByComicIdApi(id, params);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Lỗi không xác định"
    );
  }
});

export const getAllCommentByChapterId = createAsyncThunk<
  CommentResponse,
  { id: number; params: commentParams }
>("comment/getAllCommentByChapterId", async ({ id, params }, thunkAPI) => {
  try {
    return await getAllCommentByChapterIdApi(id, params);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Lỗi không xác định"
    );
  }
});

interface CommentState extends CommentResponse {
  loading: boolean;
}

const initialState: CommentState = {
  data: [],
  totalComment: 0,
  totalItem: 0,
  totalPage: 0,
  totalItemPerPage: 10,
  currentPage: 1,
  prevPage: 1,
  nextPage: 1,
  loading: false,
};

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (buidler) => {
    buidler
      .addCase(getAllCommentByComicId.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllCommentByComicId.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(getAllCommentByChapterId.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllCommentByChapterId.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      });
  },
});

export default commentSlice.reducer;
