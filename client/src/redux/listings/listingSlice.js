// redux/listings/listingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listings: [],
};

const listingSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    setListings: (state, action) => {
      state.listings = action.payload;
    },
  },
});

export const { setListings } = listingSlice.actions;
export default listingSlice.reducer;
