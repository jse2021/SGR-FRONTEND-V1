/**
 * Va a servir para manejar y hacer dispatch de accioens y 
 * controlar todo lo relacionado al ui store
 */

import { useDispatch, useSelector } from "react-redux"
import { onOpenDateModal, onCloseDateModal } from "../store";

//manipulo el store
export const useUiStore = ()=>{
    const dispatch = useDispatch();
    const {isDateModalOpen} = useSelector(state=> state.ui);

    //para abril el modal al seleccionar un evento
    const openDateModal =()=>{
        dispatch(onOpenDateModal())
    }

    const closeDateModal =() =>{
        dispatch(onCloseDateModal());
    }

    const toggleDateModal = () =>{
        (isDateModalOpen)
            ? openDateModal()
            : closeDateModal();

    }

    return{
        //Propiedades
        isDateModalOpen,
        onCloseDateModal,

        //metodos
        openDateModal,
        closeDateModal,
        toggleDateModal
    }
}