import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  user: {
    id: number;
    email: string;
    role: string;
  } | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
      localStorage.setItem("loggedIn", "true");
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("loggedIn");
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
