import { getAllUserApi, getUserProfileApi } from "@/services/user-service";
import { User, userParams, userResponseType } from "@/types/user-type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllUser = createAsyncThunk<userResponseType, userParams>(
  "user/getAllUser",
  async (params, thunkAPI) => {
    try {
      const res = await getAllUserApi(params);
      return res;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi không xác định"
      );
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (_, thunkAPI) => {
    try {
      return await getUserProfileApi();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi không xác định"
      );
    }
  }
);

interface UserState extends userResponseType {
  userProfile: User | null;
  loading: boolean;
}

const initialState: UserState = {
  data: [],
  totalItem: 0,
  totalPage: 0,
  totalItemPerPage: 0,
  currentPage: 0,
  prevPage: 0,
  nextPage: 0,
  userProfile: null,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(getUserProfile.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload;
      });
  },
});

export default userSlice.reducer;
