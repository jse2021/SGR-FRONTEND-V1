import { configureStore } from "@reduxjs/toolkit";
import {
  uiSlice,
  calendarSlice,
  authSlice,
  canchaSlice,
  configuracionSlice,
} from "./";
import productosReducer from "./productos/productosSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    calendar: calendarSlice.reducer,
    ui: uiSlice.reducer,
    cancha: canchaSlice.reducer,
    configuracion: configuracionSlice.reducer,
    productos: productosReducer, // Este nombre es el que usás en useSelector
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
