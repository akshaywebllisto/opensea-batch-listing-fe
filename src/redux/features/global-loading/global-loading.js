import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

export const globalLoadingSlice = createSlice({
  name: "globalLoading",
  initialState,
  reducers: {
    setGlobalLoading: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGlobalLoading } = globalLoadingSlice.actions;

export default globalLoadingSlice.reducer;
