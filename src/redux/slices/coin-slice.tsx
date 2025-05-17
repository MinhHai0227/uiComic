import { getAllCoinApi } from "@/services/coin-service";
import { Coin } from "@/types/coin-type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllCoin = createAsyncThunk(
  "coin/getAllCoin",
  async (_, thunkAPI) => {
    try {
      return await getAllCoinApi();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Lỗi không xác định"
      );
    }
  }
);

interface CoinState {
  data: Coin[];
  loading: boolean;
}

const initialState: CoinState = {
  data: [],
  loading: false,
};

export const coinSlice = createSlice({
  name: "coin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCoin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllCoin.fulfilled, (state, action) => {
        (state.loading = false), (state.data = action.payload);
      });
  },
});

export default coinSlice.reducer;
