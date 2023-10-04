import { useDispatch, useSelector } from 'react-redux'
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from '../store';

/**
 * INTERACCIONA CON EL STORE
 * PARA PROPORCIONAR LOS EVENTOS AL CALENDARIO
 */
export const useCalendarStore = () => {
    const dispatch = useDispatch();
    const {events, activeEvent} = useSelector(state => state.calendar);

    const SetActiveEvent = (calendarEvent) => {
      dispatch(onSetActiveEvent(calendarEvent));
    }

    // inicia proceso de grabacion
    const startSavingEvent = async(calendarEvent) => {
      if (calendarEvent._id) {
        // actualizando
        dispatch(onUpdateEvent({calendarEvent}))
      }else{
        // creando
        dispatch(onAddNewEvent({...calendarEvent, _id: new Date().getTime()}))
      }
    }

    const startDeletingEvent = () =>{
      //falta llegar al backend
      dispatch(onDeleteEvent());
    }
      
  return {
    //propiedades
    activeEvent,
    events  ,
    hasEventSelected: !!activeEvent,

    //metodos
    SetActiveEvent,
    startSavingEvent,
    startDeletingEvent

  }
}
