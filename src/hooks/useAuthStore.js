import { useDispatch, useSelector } from "react-redux"
import {calendarApi} from '../api'

export const useAuthStore =() =>{

    const{status, user, errorMessage} = useSelector(state => state.auth || 'pending');    
    const dispatch = useDispatch();

    const startLogin = async ({email, password}) => {
        console.log({email, password});

        try {
            
            const resp = await calendarApi.post('/auth',{email,password});
        } catch (error) {
            console.log({error})
            
        }
    }
'pending'
   

    return{
        //propiedades
        status,
        user, 
        errorMessage,

        //metodos
        startLogin
    }
}

// const state = useSelector((state) => state.auth);
    // if (!state) {
    //   return {};
    // }
  
    // const { status, user, errorMessage } = state;