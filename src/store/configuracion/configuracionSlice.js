import { createSlice } from "@reduxjs/toolkit";

export const configuracionSlice = createSlice({
  name: "configuracion",
  initialState: {
    status: "checking",
    errorMessage: undefined,
    precio: {},
  },

  reducers: {
    nuevoPrecio: (state, { payload }) => {
      state.status = "registrado";
      state.precio = payload;
      state.errorMessage = undefined;
    },
    onCheckingConfiguracion: (state) => {
      state.status = "registrado";
      state.precio = {};
      state.errorMessage = undefined;
    },
  },
});

export const { nuevoPrecio, onCheckingConfiguracion } =
  configuracionSlice.actions;
