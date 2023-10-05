import { useDispatch, useSelector } from "react-redux"
import {calendarApi} from '../api'

export const useAuthStore =() =>{

    const{status, user, errorMessage} = useSelector(state => state.auth || 'checking');    
    const dispatch = useDispatch();

    const startLogin = async ({user, password}) => {
        console.log({user, password});

        try {
            
            const resp = calendarApi.post('/auth',{user, password})
            console.log({resp})

        } catch (error) {
            console.log({error})    
        }
    }   

    return{
        //propiedades
        status,
        user, 
        errorMessage,

        //metodos
        startLogin
    }
}