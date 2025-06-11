import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isDateModalOpen: false,
    isModalUsuarioOpen: false,
    activeUsuario: null,
  },
  reducers: {
    /**
     * RESERVAS
     */
    onOpenDateModal: (state) => {
      state.isDateModalOpen = true;
    },
    onCloseDateModal: (state) => {
      state.isDateModalOpen = false;
    },
    /**
     * USUARIOS
     */
    onOpenModalUsuario: (state) => {
      state.isModalUsuarioOpen = true;
    },
    onCloseModalUsuario: (state) => {
      state.isModalUsuarioOpen = false;
    },
    onSetActiveUsuario: (state, { payload }) => {
      state.activeUsuario = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onOpenDateModal,
  onCloseDateModal,
  onOpenModalUsuario,
  onCloseModalUsuario,
  onSetActiveUsuario,
} = uiSlice.actions;
