import {
  getAllCategoryApi,
  getCategoryBySlugApi,
} from "@/services/category-service";
import {
  Category,
  categoryParams,
  CategorySlugResponseType,
} from "@/types/category-type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type categoryArg = {
  slug: string;
  params: categoryParams;
};

export const getAllCategory = createAsyncThunk(
  "category/getAllCategory",
  async (_, thunkAPI) => {
    try {
      return await getAllCategoryApi();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi không xác định"
      );
    }
  }
);

export const getCategoryBySlug = createAsyncThunk<
  CategorySlugResponseType,
  categoryArg
>("category/getCategoryBySlug", async ({ slug, params }, thunkAPI) => {
  try {
    return await getCategoryBySlugApi(slug, params);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Lỗi không xác định"
    );
  }
});

interface Categorystate {
  data: Category[];
  categorySlug: CategorySlugResponseType | null;
  loading: boolean;
}

const initialState: Categorystate = {
  data: [],
  categorySlug: null,
  loading: false,
};

export const CategorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    resetCategorySlug: (state) => {
      state.categorySlug = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllCategory.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getCategoryBySlug.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCategoryBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.categorySlug = action.payload;
      });
  },
});
export const { resetCategorySlug } = CategorySlice.actions;
export default CategorySlice.reducer;
