import { createContext, useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Navbar,  CalendarModal, FabDelete} from '../';
import CalendarEvent from '../components/CalendarEvent';

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
      const style = {
          backgroundColor: '#000000',
          // backgroundColor: isMyEvent? '#347cf7': '#465660',
          borderRadius: '5px',
          opacity:0.9,
          color: 'white',
          fontSize: '10px'
      }

      return {
        
          style
      }
  }
  
    const handleSelectSlot = (event) =>{

      setDate(event.start)
      openDateModal();
      
    }

    const onDoubleClick = (event)=> {
      console.log({dooubleClick:event})
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
}, [startLoadingEvents()])// ES ASI ?

  return (
    <>
      <Navbar />
      
      <Calendar
        culture='es'
        defaultView={lastView}
        localizer={localizer}
        events={ events }
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc( 100vh - 80px )' }}
        messages={ getMessagesES() }
        eventPropGetter = {eventStyleGetter}
        components={{
          event:CalendarEvent
        }}
        views={[ 'month', 'agenda' ]}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}
        onSelectSlot={handleSelectSlot}
        selectable

      />
        <CalendarModal date={date} cliente={cliente}/>
        <FabDelete />
    </>
  )
}
