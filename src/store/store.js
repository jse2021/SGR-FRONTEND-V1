import { configureStore } from "@reduxjs/toolkit";
import {
  uiSlice,
  calendarSlice,
  authSlice,
  canchaSlice,
  configuracionSlice,
} from "./";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    calendar: calendarSlice.reducer,
    ui: uiSlice.reducer,
    cancha: canchaSlice.reducer,
    configuracion: configuracionSlice.reducer,
  },
  /**
   * Esto desactiva un warning que aparece cuando se guardan objetos no serializables en Redux
   *  (por ejemplo: fechas, instancias de clases, etc.).
   */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
