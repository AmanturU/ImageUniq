// features/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  email: null,
  is_paid: false,
  daily_usage_limit: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.is_paid = action.payload.is_paid;
      state.daily_usage_limit = action.payload.daily_usage_limit;
    },
    clearUser: () => {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
