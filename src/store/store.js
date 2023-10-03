import { configureStore } from "@reduxjs/toolkit";
import { uiSlice, calendarSlice } from "./ui/uiSlice";

export const store = configureStore({
    reducer: {
        calendar: calendarSlice.reducer,
        ui: uiSlice.reducer
    }

})