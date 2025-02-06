import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  videoId: null,
};

const playlistSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    popin: (state, action) => {
      state.status = true;
      state.videoId = action.payload.videoId;
    },
    popOut: (state) => {
      state.status = false;
      state.videoId = null;
    },
  },
});

export const { popOut, popin } = playlistSlice.actions;

export default playlistSlice.reducer;
