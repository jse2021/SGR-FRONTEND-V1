// import { createSlice } from "@reduxjs/toolkit";

// export const authSlice = createSlice({
//   name: "auth",
//   isLoadingUser: true,
//   initialState: {
//     status: "checking", // 'authenticated','not-authenticated',
//     user: {}, // Info del usuario logueado (nombre, email, tipo, etc)
//     errorMessage: undefined,
//   },

//   reducers: {
//     onChecking: (state) => {
//       state.status = "checking";
//       state.user = {};
//       state.errorMessage = undefined;
//     },
//     onLogin: (state, { payload }) => {
//       state.status = "authenticated";
//       state.user = payload.user;
//       state.errorMessage = undefined;
//     },
//     onLogout: (state, { payload }) => {
//       state.status = "not-authenticated";
//       state.user = {};
//       state.errorMessage = payload;
//     },
//     clearErrorMessage: (state) => {
//       state.errorMessage = undefined;
//     },
//   },
// });

// // Action creators are generated for each case reducer function
// export const { onChecking, onLogin, onLogout, clearErrorMessage } =
//   authSlice.actions;
import { createSlice } from "@reduxjs/toolkit";

// ✅ Recuperar usuario desde localStorage si existe
const storedUser = localStorage.getItem("user");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

// ✅ Estado inicial según si hay usuario guardado
const initialState = {
  status: parsedUser ? "authenticated" : "checking", // 'authenticated','not-authenticated','checking'
  user: parsedUser || {}, // Info del usuario logueado
  errorMessage: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  isLoadingUser: true,
  initialState,
  reducers: {
    onChecking: (state) => {
      state.status = "checking";
      state.user = {};
      state.errorMessage = undefined;
    },
    onLogin: (state, { payload }) => {
      state.status = "authenticated";
      state.user = payload.user;
      state.errorMessage = undefined;
    },
    onLogout: (state, { payload }) => {
      state.status = "not-authenticated";
      state.user = {};
      state.errorMessage = payload;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = undefined;
    },
  },
});

export const { onChecking, onLogin, onLogout, clearErrorMessage } =
  authSlice.actions;
