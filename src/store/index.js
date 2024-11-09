import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import userReducer from "../features/userSlice";
import authReducer from "../features/authSlice";
import { authApi } from "../services/auth";
import { userApi } from "../services/user";
import { paymentApi } from "../services/payment";
import { cryptoPaymentApi } from "../services/cryptoPayment";
import { productSlice } from "../services/products";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user", "auth"],
};

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [productSlice.reducerPath]: productSlice.reducer,
  [cryptoPaymentApi.reducerPath]: cryptoPaymentApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      authApi.middleware,
      userApi.middleware,
      paymentApi.middleware,
      cryptoPaymentApi.middleware,
      productSlice.middleware,
    ]),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
