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
  // PARA ALMACENAR LA VISTA EN EL STORAGE
  const [ lastView, setLastView ] = useState(localStorage.getItem('lastView') || 'month' );
  const [date, setDate] = useState('');
  const [cliente, setCliente] = useState(null);

    useEffect(() => {
            window.addEventListener("clienteSeleccionado", (event) => {
            setCliente(event.detail);
        });
    }, []);

    /**
     * DISEÑO DE LOS EVENTOS, "BOTON"
     */
    const eventStyleGetter = (event, start, end,isSelected) =>{

        //*Verifico que el evento sea el que creo el usuario
        // const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid);

        console.log({event, start, end,isSelected})
        const style = {
            backgroundColor: isMyEvent? '#347cf7': '#465660',
            borderRadius: '5px',
            opacity:0.8,
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

    const onDoubleClick = (event)=> {
      // console.log({dooubleClick:event})
      openDateModal();
  
  }

    //para activar la reserva seleccioanda
    const onSelect = (event) => {
      setActiveEvent(event)
    }

    /**
     * CUANDO CAMBIA LA VISTA
     */
    const onViewChanged = (event) => { 
      console.log({viewChange:event})
      localStorage.setItem('lastView',event);
  
  }

   useEffect(()=>{
        startLoadingEvents();
    },[])

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
        style={{ height: 'calc( 100vh - 80px )' }}
        messages={ getMessagesES() }
        eventPropGetter={ eventStyleGetter }
        components={{
          event : CalendarEvent
        }}
        onSelectEvent={onSelect}
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
