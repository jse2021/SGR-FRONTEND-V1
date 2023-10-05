import { useDispatch, useSelector } from "react-redux"

export const useAuthStore =() =>{

    const{status, user, errorMessage} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const startLogin = async ({email, password}) => {
        console.log({email, password});
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

// const state = useSelector((state) => state.auth);
    // if (!state) {
    //   return {};
    // }
  
    // const { status, user, errorMessage } = state;