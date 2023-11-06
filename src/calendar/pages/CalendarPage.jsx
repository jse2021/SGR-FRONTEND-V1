import { createContext, useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Navbar, CalendarEvent, CalendarModal, FabDelete} from '../';

import { localizer, getMessagesES } from '../../helpers';
import { useUiStore, useCalendarStore } from '../../hooks';


export const CalendarPage = () => {

  const { openDateModal } = useUiStore();
  const { events, setActiveEvent,startLoadingEvents } = useCalendarStore();
  const [ lastView, setLastView ] = useState(localStorage.getItem('lastView') || 'month' );
  const [date, setDate] = useState('');

  const [cliente, setCliente] = useState(null);
3
  useEffect(() => {
          window.addEventListener("clienteSeleccionado", (event) => {
          setCliente(event.detail);
      });
  }, []);

  const eventStyleGetter = ( event, start, end, isSelected ) => {

    const style = {
      backgroundColor: '#347CF7',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white'
    }

    return {
      style
    }
  }
  
  const handleSelectSlot = (event) =>{
    const fecha = event.start.toISOString()
    setDate(stringifyDate(fecha))
    console.log('ANTES DE FORMATEAR: ',fecha)
    openDateModal();
    
   }

   const stringifyDate = (date) => {
    console.log('xxxxxxxxx',date)
    // Obtener la fecha recibida en el parámetro `date`
    const dateObj = new Date(date);
  
    // Obtener la hora actual en la zona horaria UTC
    const now = Date.now();
  
    // Crear una nueva fecha con la hora establecida en 00:00:00
    const newDateObj = new Date(dateObj.getTime());
  
    // Formatear la fecha con el formato `YYYY-MM-DDTHH:mm:ss.SSSZ`
    const formattedDate = new Date(newDateObj).toISOString();
    console.log('infuncion: '+formattedDate)
    return formattedDate;
  };
  

  console.log('Calendario: ', date)
  const onViewChanged = ( event ) => {
    localStorage.setItem('lastView', event );
    setLastView( event )
  }
  // 2023-11-25T00:00:00.000Z
  useEffect(() => {
    startLoadingEvents()
  }, [])

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
        style={{ height: 'calc( 100vh - 80px )' }}
        messages={ getMessagesES() }
        eventPropGetter={ eventStyleGetter }
        components={{
          event: CalendarEvent
        }}
        onSelectSlot={handleSelectSlot}
        selectable
        onView={ onViewChanged }

      />
        <CalendarModal date={date} cliente={cliente}/>
        <FabDelete />
    </>
  )
}
