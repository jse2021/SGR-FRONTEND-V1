import { useDispatch, useSelector } from 'react-redux';
import { calendarApi } from '../api';
import { onCheckingCancha } from '../store';


export const useCanchaStore = () => {

    const { status } = useSelector( state => state.cancha);
    const dispatch = useDispatch();

    const startRegister = async({ nombre, medidas}) => {
        
        try {
            dispatch( onCheckingCancha());    
            const { data } = await calendarApi.post('/cancha/crearCancha',{ nombre, medidas});
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() ); 
            
        } catch (error) {
            console.log({error})
            //dispatch(onLogout(error.response.data?.errors.msg || 'Error al registrarse'))
            // setTimeout(() => {
            //     dispatch( clearErrorMessage() );
            // }, 10);
        }
    }

    return{


        startRegister
    }







}