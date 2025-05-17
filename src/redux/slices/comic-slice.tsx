import { getAllComicApi, getComicBySlugApi } from "@/services/comic-service";
import {
  comicParams,
  ComicResponseType,
  ComicSlugResponeType,
} from "@/types/comic-type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllComic = createAsyncThunk<ComicResponseType, comicParams>(
  "comic/getAllComic",
  async (params, thunkAPI) => {
    try {
      return await getAllComicApi(params);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi không xác định"
      );
    }
  }
);

export const getComicBySlug = createAsyncThunk<ComicSlugResponeType, string>(
  "comic/getComicBySlug",
  async (slug, thunkAPI) => {
    try {
      return await getComicBySlugApi(slug);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi không xác định"
      );
    }
  }
);

interface ComicState extends ComicResponseType {
  comicSlug: ComicSlugResponeType | null;
  loading: boolean;
}

const initialState: ComicState = {
  data: [],
  comicSlug: null,
  totalItem: 0,
  totalPage: 0,
  totalItemPerPage: 0,
  currentPage: 0,
  prevPage: 0,
  nextPage: 0,
  loading: false,
};

export const comicSlice = createSlice({
  name: "comic",
  initialState,
  reducers: {},
  extraReducers: (buidler) => {
    buidler
      .addCase(getAllComic.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllComic.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(getComicBySlug.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getComicBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.comicSlug = action.payload;
      });
  },
});

export default comicSlice.reducer;
