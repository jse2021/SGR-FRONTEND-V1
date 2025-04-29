import { useDispatch, useSelector } from 'react-redux';
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent, onLoadEvents, onLogin } from '../store';
import { calendarApi } from '../api';
import { convertEventsToDateEvents } from '../helpers';
import { useState } from 'react';
import Swal from 'sweetalert2';


/**
 * DE ACA LLEGAMOS AL BACKEN Y RELIZAMOS LOS PROCESOS
 */
export const useCalendarStore = () => {

    const { events, activeEvent } = useSelector( state => state.calendar );
    const {user} =useSelector(state=> state.auth)
    const dispatch = useDispatch();
    
    /**
     * TOMO LA INFO DEL STORE, Y DISPARO PARA TOMAR DEL CALENDAR PAGE
     */

    const setActiveEvent = (calendarEvent)=>{
        dispatch(onSetActiveEvent(calendarEvent))
    }

    /**
     *  PROCESO DE GRABACION DEL EVENTO
     */

    const startSavingEvent = async( calendarEvent ) => {

        try {

        if( calendarEvent.id ) {
            // Actualizando
            const {data} = await calendarApi.put(`/reserva/${calendarEvent.id}`, calendarEvent)
            dispatch( onUpdateEvent({ ...calendarEvent, user }) );
            
        }  
            // Creando
            const {data} = await calendarApi.post('/reserva', calendarEvent)
            // de lo que viene del calendarEvent, le agrego el usuario y el id
            dispatch( onAddNewEvent({ ...calendarEvent, user, id: data._id }) );   
            Swal.fire({
                icon: 'success',
                title: 'Reserva registrada',    
                showConfirmButton: false,
                timer: 1200
         })          

        } catch (error) {
            Swal.fire('Error al guardar',error.response.data.msg,'error');
            console.log({error});
        }
       }

    const startDeletingEvent = async() => {

        try {
            await calendarApi.delete(`/reserva/${activeEvent.id}`)
            // Todo: Llegar al backend
            dispatch( onDeleteEvent() );

        } catch (error) {
            console.log(error)
        }
    }

    /**
     * TRAIGO LOS EVENTOS DEL BACKEND PARA MOSTRAR EN PANTALLA
     * tiene que ser llamado en calendarPage
     */
    const startLoadingEvents = async() => {
        try {

            const {data} = await calendarApi.get('/reserva');
            const events = convertEventsToDateEvents(data.reservas);
            dispatch(onLoadEvents(events));
            
        } catch (error) { 
            console.log('error cargando eventos')
            console.log({error})
        }
    }

    return {
        //* Propiedades
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,

        //* Métodos
        startDeletingEvent,
        setActiveEvent,
        startSavingEvent,
        startLoadingEvents
    }
}
export default useCalendarStore;