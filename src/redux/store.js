import { configureStore } from "@reduxjs/toolkit";
import addressReducer from "./features/walletData/addressSlice";
import openseaAssetsReducer from "./features/openseaData/openseaAssetsSlice";
import openseaEventsReducer from "./features/openseaData/openseaEventsSlice";
import nftCartReducer from "./features/selected-nft-cart/nftCard";
import globalLoadingReducer from "./features/global-loading/global-loading";
export default configureStore({
  reducer: {
    walletAddress: addressReducer,
    assetsdata: openseaAssetsReducer,
    eventsdata: openseaEventsReducer,
    nftCartData: nftCartReducer,
    globalLoadingValue: globalLoadingReducer,
  },
});
