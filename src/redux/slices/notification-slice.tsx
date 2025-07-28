import { getNotificationByUserApi } from "@/services/notification-service";
import {
  NotificationPaginationResponse,
  NotificationParams,
} from "@/types/notification-type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getNotificationByUser = createAsyncThunk<
  NotificationPaginationResponse,
  NotificationParams
>("notification/getNotificationByUser", async (params, thunkAPI) => {
  try {
    return await getNotificationByUserApi(params);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Lỗi không xác định"
    );
  }
});

interface NotificationState extends NotificationPaginationResponse {
  loading: boolean;
}

const initialState: NotificationState = {
  data: [],
  unseenCount: 0,
  totalItem: 0,
  totalPage: 0,
  totalItemPerPage: 0,
  currentPage: 0,
  prevPage: 0,
  nextPage: 0,
  loading: false,
};

const notificatinSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (buidler) => {
    buidler
      .addCase(getNotificationByUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getNotificationByUser.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      });
  },
});

export default notificatinSlice.reducer;
