import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import toggleSlice from "./toggleSlice.js";
import playlistSlice from "./playlistSlice.js";
const store = configureStore({
  reducer: {
    auth: authSlice,
    toggle: toggleSlice,
    playlistPop: playlistSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
