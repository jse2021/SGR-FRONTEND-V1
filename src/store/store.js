import { configureStore } from '@reduxjs/toolkit';
import { uiSlice, calendarSlice, authSlice, canchaSlice, configuracionSlice } from './';


export const store = configureStore({
    reducer: {
        auth:     authSlice.reducer,
        calendar: calendarSlice.reducer,
        ui:       uiSlice.reducer,
        cancha: canchaSlice.reducer,
        configuracion: configuracionSlice.reducer
        
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})
