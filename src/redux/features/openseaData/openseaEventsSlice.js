import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL_OPENSEA = process.env.REACT_APP_OPENSEA_BASE_API;
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_API;

export const openseaEventsSlice = createSlice({
  name: "eventsdata",
  initialState: {
    userEventData: [],
    eventloading: false,
  },
  reducers: {
    getOpenseaEventsData: (state, action) => {
      state.userEventData = action.payload;
    },
    setEventLoadiing: (state, action) => {
      state.eventloading = action.payload;
    },
  },
});

export const getOpenseaEventsAsync = (address) => async (dispatch) => {
  let assets = [];
  let response;
  try {
    dispatch(setEventLoadiing(true));
    response = await axios.get(
      `${BASE_URL}/owner/events?owner_address=${address}`
    );
    assets = response.data.payload;
    dispatch(setEventLoadiing(false));
  } catch (err) {
    dispatch(setEventLoadiing(false));

    return false;
  }

  dispatch(getOpenseaEventsData(assets));
};

export const { getOpenseaEventsData, setEventLoadiing } =
  openseaEventsSlice.actions;
export const showOpenseaEventsData = (state) => state.eventsdata.data;
export default openseaEventsSlice.reducer;
