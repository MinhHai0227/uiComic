import { getAllCountryApi } from "@/services/country-service";
import { Country } from "@/types/country-type";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllCountry = createAsyncThunk(
  "country/getAllCountry",
  async (_, thunkAPI) => {
    try {
      return await getAllCountryApi();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.respone?.data?.message || "Lỗi không xác định"
      );
    }
  }
);

interface CountryState {
  data: Country[];
  loading: boolean;
}

const initialState: CountryState = {
  data: [],
  loading: false,
};

export const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCountry.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
  },
});

export default countrySlice.reducer;
