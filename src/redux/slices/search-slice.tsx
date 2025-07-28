import { searchComicApi } from "@/services/comic-service";
import { ComicResponseType, searchParams } from "@/types/comic-type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const searchComic = createAsyncThunk<ComicResponseType, searchParams>(
  "comic/searchComic",
  async (params, thunkAPI) => {
    try {
      return await searchComicApi(params);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi không xác định"
      );
    }
  }
);

interface ComicState extends ComicResponseType {
  loading: boolean;
}

const initialState: ComicState = {
  data: [],
  totalItem: 0,
  totalPage: 0,
  totalItemPerPage: 0,
  currentPage: 0,
  prevPage: 0,
  nextPage: 0,
  loading: false,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (buidler) => {
    buidler
      .addCase(searchComic.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(searchComic.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      });
  },
});

export default searchSlice.reducer;
