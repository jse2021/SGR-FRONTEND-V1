import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { uiSlice} from "./ui/uiSlice";
import {calendarSlice } from "./calendar/calendarSlice";


/**
 * FACILITA EL ACCESO AL CALENDARIO Y UI DE MODAL
 */
export const store = configureStore({
    reducer: {
        calendar: calendarSlice.reducer,
        ui: uiSlice.reducer
    },
    middleware: (getDefaultMiddleware)=> getDefaultMiddleware({
        serializableCheck: false //para que no revise las fechas despues de serializar
    })
})