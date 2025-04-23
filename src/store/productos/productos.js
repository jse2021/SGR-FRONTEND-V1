// src/store/productos/productosSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productos: [],
  error: null,
};

export const productosSlice = createSlice({
  name: 'productos',
  initialState,
  reducers: {
    agregarProducto: (state, action) => {
      const nombre = action.payload.trim().toLowerCase();

      const existe = state.productos.find(
        (p) => p.nombre.toLowerCase() === nombre
      );

      if (existe) {
        state.error = "Ese producto ya existe.";
      } else if (nombre.length < 3) {
        state.error = "El nombre debe tener al menos 3 caracteres.";
      } else {
        state.productos.push({
          id: Date.now(),
          nombre: action.payload,
        });
        state.error = null;
      }
    },
    eliminarProducto: (state, action) => {
      state.productos = state.productos.filter(p => p.id !== action.payload);
    },
    limpiarError: (state) => {
      state.error = null;
    }
  },
});

export const { agregarProducto, eliminarProducto, limpiarError } = productosSlice.actions;
export default productosSlice.reducer;
