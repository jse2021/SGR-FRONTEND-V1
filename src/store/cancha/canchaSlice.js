import { createSlice } from '@reduxjs/toolkit';

export const canchaSlice = createSlice({
    name: 'cancha',
    initialState: {
        status: 'no registrado',
        errorMessage: undefined,
        cancha:{}
    },

    reducers: {
        nuevaCancha: (state, {payload}) =>{
            state.status = 'registrada';
            state.cancha = payload;
            state.errorMessage = undefined;
        },
        clearErrorMessage: ( state ) => {
            state.errorMessage = undefined;
        },
    }
})
export const { nuevaCancha, clearErrorMessage} = canchaSlice.actions;