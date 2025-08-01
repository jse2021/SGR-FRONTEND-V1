import { createSlice } from "@reduxjs/toolkit";

export const canchaSlice = createSlice({
  name: "cancha",
  initialState: {
    status: "checking",
    errorMessage: undefined,
    cancha: {},
  },

  reducers: {
    nuevaCancha: (state, { payload }) => {
      state.status = "registrada";
      state.cancha = payload;
      state.errorMessage = undefined;
    },
    onCheckingCancha: (state) => {
      state.status = "registrada";
      state.cancha = {};
      state.errorMessage = undefined;
    },
  },
});
export const { nuevaCancha, onCheckingCancha } = canchaSlice.actions;
