import { useDispatch, useSelector } from 'react-redux';
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent, onLoadEvents, onLogin } from '../store';
import { calendarApi } from '../api';
import { convertEventsToDateEvents } from '../helpers';


export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector( state => state.calendar );
    const {user} = useSelector(state => state.auth)
    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) )
    }

    const startSavingEvent = async( calendarEvent ) => {
        // TODO: llegar al backend
        // Todo bien
        if( calendarEvent._id ) {
            // Actualizando
            dispatch( onUpdateEvent({ ...calendarEvent }) );
        } else {
            // Creando
            const {data} = await calendarApi.post('/reserva', calendarEvent)
            console.log({data})
            dispatch( onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }) );    
        }
    }

    const startDeletingEvent = () => {
        // Todo: Llegar al backend

        dispatch( onDeleteEvent() );
    }

    const startLoadingEvents = async() => {
        try {

            const {data} = await calendarApi.get('/reserva');
            const events = convertEventsToDateEvents(data.reservas);
            dispatch(onLoadEvents(events));
            // console.log({events})
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
