import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isDateModalOpen: false,

    isModalUsuarioOpen: false,
    activeUsuario: null,

    isModalClienteOpen: false,
    activeCliente: null,

    isModalCanchaOpen: false,
    activeCancha: null,
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
    /**
     * CLIENTES
     */
    onOpenModalCliente: (state) => {
      state.isModalClienteOpen = true;
    },
    onCloseModalCliente: (state) => {
      state.isModalClienteOpen = false;
    },
    onSetActiveCliente: (state, { payload }) => {
      state.activeCliente = payload;
    },
    /**
     * CANCHAS
     */
    onOpenModalCancha: (state) => {
      state.isModalCanchaOpen = true;
    },
    onCloseModalCancha: (state) => {
      state.isModalCanchaOpen = false;
    },
    onSetActiveCancha: (state, { payload }) => {
      state.activeCancha = payload;
    },
  },
});

export const {
  onOpenDateModal,
  onCloseDateModal,

  onOpenModalUsuario,
  onCloseModalUsuario,
  onSetActiveUsuario,

  onOpenModalCliente,
  onCloseModalCliente,
  onSetActiveCliente,

  onOpenModalCancha,
  onCloseModalCancha,
  onSetActiveCancha,
} = uiSlice.actions;
