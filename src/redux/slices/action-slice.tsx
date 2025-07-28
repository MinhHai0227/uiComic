import { getTopViewComicApi } from "@/services/comic-service";
import { ComicResponseType, topViewComicParams } from "@/types/comic-type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getTopViewComic = createAsyncThunk<
  ComicResponseType,
  topViewComicParams
>("comic/getTopViewComic", async (params, thunkAPI) => {
  try {
    return await getTopViewComicApi(params);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Lỗi không xác định"
    );
  }
});

interface ActionState {
  data: ComicResponseType | null;
  loading: boolean;
}

const initialState: ActionState = {
  data: null,
  loading: false,
};

export const actionSlice = createSlice({
  name: "action",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTopViewComic.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getTopViewComic.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
  },
});

export default actionSlice.reducer;
