import {
  getDoanhThuNowApi,
  getListDoanhThuApi,
  topUserPaymentApi,
} from "@/services/transition-service";
import {
  MonthlyRevenue,
  RevenueResponse,
  UserPayment,
} from "@/types/transition-type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getDoanhThuNow = createAsyncThunk<RevenueResponse>(
  "transition/getDoanhThuNow",
  async (_, thunkAPI) => {
    try {
      return await getDoanhThuNowApi();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.respone?.data?.message || "Lỗi không xác định"
      );
    }
  }
);

export const topUserPayment = createAsyncThunk<UserPayment[]>(
  "transition/topUserPayment",
  async (_, thunkAPI) => {
    try {
      return await topUserPaymentApi();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.respone?.data?.message || "Lỗi không xác định"
      );
    }
  }
);

export const getListDoanhThu = createAsyncThunk<MonthlyRevenue[], number>(
  "transition/getListDoanhThu",
  async (limit, thunkAPI) => {
    try {
      return await getListDoanhThuApi(limit);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.respone?.data?.message || "Lỗi không xác định"
      );
    }
  }
);

interface transitionState {
  doanhThu: RevenueResponse | null;
  topUser: UserPayment[];
  doanhThuPre: MonthlyRevenue[];
  loading: boolean;
}

const initialState: transitionState = {
  doanhThu: null,
  topUser: [],
  doanhThuPre: [],
  loading: false,
};

const transactionSlice = createSlice({
  name: "transition",
  initialState,
  reducers: {},
  extraReducers: (buidler) => {
    buidler
      .addCase(getDoanhThuNow.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDoanhThuNow.fulfilled, (state, action) => {
        state.loading = false;
        state.doanhThu = action.payload;
      })
      .addCase(topUserPayment.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(topUserPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.topUser = action.payload;
      })
      .addCase(getListDoanhThu.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListDoanhThu.fulfilled, (state, action) => {
        state.loading = false;
        state.doanhThuPre = action.payload;
      });
  },
});

export default transactionSlice.reducer;
