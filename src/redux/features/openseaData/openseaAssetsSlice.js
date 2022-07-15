import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL_OPENSEA = process.env.REACT_APP_OPENSEA_BASE_API;
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_API;
export const openseaAssetsSlice = createSlice({
  name: "assetsdata",
  initialState: {
    userAssetData: [],
    assetloading: false,
  },
  reducers: {
    getOpenseaAssetsData: (state, action) => {
      state.userAssetData = action.payload;
    },
    addFlagForNftInCart: (state, action) => {
      state.userAssetData[action.payload.idx] = {
        ...state.userAssetData[action.payload.idx],
        isSelected: action.payload.value,
      };
    },
    addFlagForNftInCartById: (state, action) => {
      state.userAssetData = state.data.map((nft) => {
        if (action.payload.nftId === nft.id) {
          nft.isSelected = false;
        }
        return nft;
      });
    },
    removeFlagForAllNftInCart: (state) => {
      state.userAssetData = state.userAssetData.map((nft) => {
        nft.isSelected = false;
        return nft;
      });
    },
    SetAssetApiLoading: (state, action) => {
      state.assetloading = action.payload;
    },
  },
});

export const getOpenseaAssetsAsync = (address) => async (dispatch) => {
  let response;
  let assets = [];

  try {
    dispatch(SetAssetApiLoading(true));
    response = await axios.get(
      `${BASE_URL}/owner/assets?owner_address=${address}`
    );

    assets = response.data.payload;
    dispatch(getOpenseaAssetsData(assets));
    dispatch(SetAssetApiLoading(false));
  } catch (err) {
    dispatch(SetAssetApiLoading(false));
  }
};

export const {
  getOpenseaAssetsData,
  addFlagForNftInCart,
  removeFlagForAllNftInCart,
  addFlagForNftInCartById,
  SetAssetApiLoading,
} = openseaAssetsSlice.actions;
export const showOpenseaAssetsData = (state) => state.assetsdata.data;
export default openseaAssetsSlice.reducer;
