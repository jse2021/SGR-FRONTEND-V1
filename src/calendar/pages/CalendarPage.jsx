import { createContext, useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Navbar, CalendarEvent, CalendarModal, FabDelete} from '../';

import { localizer, getMessagesES } from '../../helpers';
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks';


export const CalendarPage = () => {

  const {user} = useAuthStore();
  const { openDateModal } = useUiStore();
  const { events, setActiveEvent,startLoadingEvents } = useCalendarStore();
  const [ lastView, setLastView ] = useState(localStorage.getItem('lastView') || 'month' );
  const [date, setDate] = useState('');
  const [cliente, setCliente] = useState(null);

    useEffect(() => {
            window.addEventListener("clienteSeleccionado", (event) => {
            setCliente(event.detail);
        });
    }, []);

    const eventStyleGetter = ( event, start, end, isSelected ) => {
    console.log( {event, start, end, isSelected} );

    const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid)

    const style = {
      backgroundColor: isMyEvent ? '#347CF7':'#347CE5',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white'
    }

    return {
      style
    }
  }
  
    const handleSelectSlot = (event) =>{

      setDate(stringifyDate(event.start))
      openDateModal();
      
    }

    const onDoubleClick = ( event )=> {
      console.log({onDoubleClick: event})
    }

    const onViewChanged = ( event ) => {
      localStorage.setItem('lastView', event );
      setLastView( event )
    }
    // 2023-11-25T00:00:00.000Z
    useEffect(() => {
      startLoadingEvents()
    }, [])

    const stringifyDate = (date) => {
    
      // Obtener la fecha recibida en el parámetro `date`
      const dateObj = new Date(date);
    
      // Obtener la hora actual en la zona horaria UTC
      const now = Date.now();
    
      // Crear una nueva fecha con la hora establecida en 00:00:00
      const newDateObj = new Date(dateObj.getTime());
    
      // Formatear la fecha con el formato `YYYY-MM-DDTHH:mm:ss.SSSZ`
      const formattedDate = new Date(newDateObj).toISOString();
    
  
      return formattedDate;
    };
  
  return (
    <>
      <Navbar />
      
      <Calendar
        culture='es'
        localizer={ localizer }
        events={ events }
        defaultView={ lastView }
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc( 100vh - 90px )' }}
        messages={ getMessagesES() }
        eventPropGetter={ eventStyleGetter }
        components={{
          event : CalendarEvent
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectSlot={handleSelectSlot}
        selectable
        onView={ onViewChanged }

      />
        <CalendarModal date={date} cliente={cliente}/>
        <FabDelete />
    </>
  )
}
