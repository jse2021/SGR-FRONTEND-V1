import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lista: []
};

export const productosSlice = createSlice({
  name: 'productos',
  initialState,
  reducers: {
    agregarProducto: (state, action) => {
      state.lista.push(action.payload);
    },
    eliminarProducto: (state, action) => {
      state.lista = state.lista.filter(p => p.id !== action.payload);
    }
  }
});

export const { agregarProducto, eliminarProducto } = productosSlice.actions;
export default productosSlice.reducer; //¡Esto es lo que importa en el store!
