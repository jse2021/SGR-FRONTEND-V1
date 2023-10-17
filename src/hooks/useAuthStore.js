import { useDispatch, useSelector } from 'react-redux';
import { calendarApi } from '../api';
import { clearErrorMessage, onChecking, onLogin, onLogout } from '../store';
import { useState } from 'react';



export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    const startLogin = async({ user, password }) => {
        dispatch( onChecking() );
        try {
            const { data } = await calendarApi.post('/auth',{ user, password });
            console.log({data})
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ user: data.user, id: data.token}) );
            
        } catch (error) {
            console.log({error})
            dispatch( onLogout(error.response.data?.msg || '--' ) );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }

    const startRegister = async({ nombre, apellido, celular, user, tipo_usuario, email, password}) => {
        dispatch( onChecking() );
        try {
            const { data } = await calendarApi.post('/auth/new',{ nombre, apellido, celular, user, tipo_usuario, email, password});
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() ); 
            dispatch( onLogin({ user: data.user, id: data.token}) );
            
        } catch (error) {
            console.log({error})
            dispatch(onLogout(error.response.data?.msg || 'Error al registrarse'))
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }


    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if ( !token ) return dispatch( onLogout() );

        try {
            const { data } = await calendarApi.get('auth/renew');
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ user: data.user, id: data.token }) );
        } catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogout());
    }



    return {
        //* Propiedades
        errorMessage,
        status, 
        user, 

        //* Métodos
        checkAuthToken,
        startLogin,
        startLogout,
        startRegister,
    }

}