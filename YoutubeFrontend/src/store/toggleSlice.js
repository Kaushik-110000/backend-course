import { createSlice, nanoid } from "@reduxjs/toolkit";
const initialState = {
  status: false,
};

const toggleSlice = createSlice({
  name: "toggle",
  initialState,
  reducers: {
    toggleStatus: (state) => {
      state.status = !state.status;
    },
  },
});

export const { toggleStatus } = toggleSlice.actions;
export default toggleSlice.reducer;
