import { getAllComicHistoryApi } from "@/services/comic-history-service";
import { ReadingHistoryResponse } from "@/types/history-type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllComicHistory = createAsyncThunk<
  ReadingHistoryResponse,
  { page: number; limit: number }
>("comichistory/getAllComicHistory", async ({ page, limit }, thunkAPI) => {
  try {
    return await getAllComicHistoryApi(page, limit);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Lỗi không xác định"
    );
  }
});

interface ComicHistoryState extends ReadingHistoryResponse {
  loading: boolean;
}

const initialState: ComicHistoryState = {
  data: [],
  totalItem: 0,
  totalPage: 0,
  totalItemPerPage: 0,
  currentPage: 0,
  prevPage: 0,
  nextPage: 0,
  loading: false,
};

const comicHistoryslice = createSlice({
  name: "comichistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllComicHistory.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllComicHistory.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      });
  },
});

export default comicHistoryslice.reducer;
