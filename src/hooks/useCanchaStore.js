import { useDispatch, useSelector } from 'react-redux';
import { calendarApi } from '../api';


export const useCanchaStore = () => {

    const { status, errorMessage } = useSelector( state => state.cancha);
    const dispatch = useDispatch();

    const startRegister = async({ nombre, medidas}) => {
        dispatch( onChecking() );
        try {
            const { data } = await calendarApi.post('/cancha/',{ nombre, apellido, celular, user, 
                                                    tipo_usuario, email, password});
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() ); 
            dispatch( onLogin({ user: data.user, id: data.token}) );
            
        } catch (error) {
            console.log({error})
            //dispatch(onLogout(error.response.data?.errors.msg || 'Error al registrarse'))
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }







}