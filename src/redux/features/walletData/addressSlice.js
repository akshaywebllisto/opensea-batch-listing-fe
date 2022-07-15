import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "",
};

export const addressSlice = createSlice({
  name: "walletAddress",
  initialState,
  reducers: {
    addAddress: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addAddress } = addressSlice.actions;

export default addressSlice.reducer;
