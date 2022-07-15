import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const nftCartSlice = createSlice({
  name: "nftCart",
  initialState,
  reducers: {
    addNftToCart: (state, action) => {
      state.value.push(action.payload);
    },
    removeNftToCart: (state, action) => {
      state.value = state.value.filter((nft) => nft.id !== action.payload);
    },
    addListingPriceToNft: (state, action) => {
      state.value[action.payload.idx] = {
        ...state.value[action.payload.idx],
        listingPrice: action.payload.value,
      };
    },

    clearCart: (state) => {
      state.value = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addNftToCart,
  removeNftToCart,
  addListingPriceToNft,
  clearCart,
} = nftCartSlice.actions;

export default nftCartSlice.reducer;
