import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id?: string | number;
  name?: string;
  email?: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
};

const tokenFromStorage = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
const userFromStorage = typeof window !== "undefined" ? localStorage.getItem("auth_user") : null;

const initialState: AuthState = {
  token: tokenFromStorage,
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      try {
        localStorage.setItem("auth_token", action.payload.token);
        localStorage.setItem("auth_user", JSON.stringify(action.payload.user));
      } catch (e) {
        // ignore
      }
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      try {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      } catch (e) {}
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
