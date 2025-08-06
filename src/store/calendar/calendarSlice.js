import { createSlice } from "@reduxjs/toolkit";

export const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    isLoadingEvents: true,
    events: [],
    activeEvent: null,
  },
  reducers: {
    //**ACTIVAR NOTA PARA MOSTRAR EN EL MODAL */
    onSetActiveEvent: (state, { payload }) => {
      state.activeEvent = payload;
    },

    onAddNewEvent: (state, { payload }) => {
      state.events.push(payload);
      /**LIMPIO EL EVENTO ACTIVO */
      state.activeEvent = null;
    },

    onUpdateEvent: (state, { payload }) => {
      state.events = state.events.map((event) => {
        if (event.id === payload.id) {
          return payload;
        }
        return event;
      });
    },

    onDeleteEvent: (state) => {
      if (state.activeEvent) {
        state.events = state.events.filter(
          (event) => event.id !== state.activeEvent.id
        );
        state.activeEvent = null;
      }
    },
    /**
     *REEMPLAZA ARRAY DE EVENTOS, AGREGANDO, Y ELIMINANDO LOS QUE ESTAN EN ESTADO INACTIVO
     */
    onLoadEvents: (state, { payload = [] }) => {
      state.isLoadingEvents = false;
      state.events = payload;
    },

    /**
     * PARA LIMPIAR EL STORE UNA VEZ QUE CERRAMOS SESION
     */
    onLogoutCalendar: (state) => {
      (state.isLoadingEvents = true),
        (state.events = []),
        (state.activeEvent = null);
    },
  },
});

export const {
  onSetActiveEvent,
  onAddNewEvent,
  onUpdateEvent,
  onDeleteEvent,
  onLoadEvents,
  onLogoutCalendar,
} = calendarSlice.actions;
