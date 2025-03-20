import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice"; // Existing user slice
import authReducer from "./auth/authSlice"; // New auth slice for authentication
import listingReducer from "./listings/listingSlice"; // Existing listings slice
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  version: 1,
  // Optional: blacklist or whitelist specific reducers if you don't want them persisted
  // blacklist: ['listings'], // Example: if you don't want listings to persist
};

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer, // Existing user reducer
  auth: authReducer, // New auth reducer for authentication
  listings: listingReducer, // Existing listings reducer
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disables serializable check for redux-persist
    }),
});

// Export persistor for use with PersistGate
export const persistor = persistStore(store);
