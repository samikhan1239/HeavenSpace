import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice"; // ✅ Correct import

export const store = configureStore({
  reducer: { user: userReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }), // ✅ Corrected middleware usage
});
