import { checkUserUnloclChapterApi } from "@/services/chapter-action-service";
import { getChapterBySlugApi } from "@/services/chapter-service";
import { ChapterSlugResponseType } from "@/types/chapter-type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getChapterBySlug = createAsyncThunk<
  ChapterSlugResponseType,
  string
>("chapter/getChapterBySlug", async (slug, thunkAPI) => {
  try {
    return await getChapterBySlugApi(slug);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Lỗi không xác định"
    );
  }
});

export const checkUserUnlockChapter = createAsyncThunk<boolean, number>(
  "chapter/checkUserunlockChapter",
  async (id, thunkAPI) => {
    try {
      return await checkUserUnloclChapterApi(id);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi không xác định"
      );
    }
  }
);

interface ChapterState {
  data: ChapterSlugResponseType | null;
  loading: boolean;
  userUnlock: boolean;
}

const initialState: ChapterState = {
  data: null,
  loading: false,
  userUnlock: false,
};

const chapterSlice = createSlice({
  name: "chapter",
  initialState,
  reducers: {},
  extraReducers: (buidler) => {
    buidler
      .addCase(getChapterBySlug.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getChapterBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(checkUserUnlockChapter.fulfilled, (state, action) => {
        state.userUnlock = action.payload;
      });
  },
});

export default chapterSlice.reducer;
