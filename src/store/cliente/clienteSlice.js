import { createSlice } from '@reduxjs/toolkit';

export const clienteSlice = createSlice({
    name: 'cliente',
    initialState: {
        status: 'checking',
        errorMessage: undefined,
        cliente:{}
    },

    reducers: {
        nuevoCliente: (state, {payload}) =>{
            state.status = 'registrado';
            state.cancha = payload;
            state.errorMessage = undefined;
        },
        onCheckingCliente: ( state ) => {
            state.status = 'registrado';
            state.cliente = {};
            state.errorMessage = undefined;
        },
    }
})
export const { nuevoCliente, onCheckingCliente} = clienteSlice.actions;