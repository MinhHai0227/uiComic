import { getAllCategoryApi } from "@/services/category-service";
import { Category } from "@/types/category-type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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

interface Categorystate {
  data: Category[];
  loading: boolean;
}

const initialState: Categorystate = {
  data: [],
  loading: false,
};

export const CategorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategory.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
  },
});

export default CategorySlice.reducer;
